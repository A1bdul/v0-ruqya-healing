from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from app.database import get_db
from app.models.audio import Audio
from app.models.user import User
from app.schemas.audio import (
    AudioCreate,
    AudioUpdate,
    AudioResponse,
    AudioListResponse,
    AudioDownloadResponse,
)
from app.core.security import get_current_admin_user

router = APIRouter(prefix="/audio", tags=["Audio Files"])


@router.get("", response_model=AudioListResponse)
async def get_audio_files(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    is_published: Optional[bool] = Query(True),
    db: Session = Depends(get_db)
):
    """Get all audio files with optional filtering."""
    query = db.query(Audio)
    
    if is_published is not None:
        query = query.filter(Audio.is_published == is_published)
    
    if category:
        query = query.filter(Audio.category == category)
    
    total = query.count()
    audio_files = query.order_by(Audio.created_at.desc()).offset(skip).limit(limit).all()
    
    return AudioListResponse(
        total=total,
        items=[AudioResponse.model_validate(a) for a in audio_files]
    )


@router.get("/{audio_id}", response_model=AudioResponse)
async def get_audio_file(audio_id: str, db: Session = Depends(get_db)):
    """Get a specific audio file by ID."""
    audio = db.query(Audio).filter(Audio.id == audio_id).first()
    
    if not audio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    
    return AudioResponse.model_validate(audio)


@router.post("", response_model=AudioResponse, status_code=status.HTTP_201_CREATED)
async def create_audio_file(
    audio_data: AudioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new audio file (Admin only)."""
    new_audio = Audio(
        id=str(uuid.uuid4()),
        **audio_data.model_dump()
    )
    
    db.add(new_audio)
    db.commit()
    db.refresh(new_audio)
    
    return AudioResponse.model_validate(new_audio)


@router.patch("/{audio_id}", response_model=AudioResponse)
async def update_audio_file(
    audio_id: str,
    audio_data: AudioUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update an audio file (Admin only)."""
    audio = db.query(Audio).filter(Audio.id == audio_id).first()
    
    if not audio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    
    # Update fields
    update_data = audio_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(audio, field, value)
    
    db.commit()
    db.refresh(audio)
    
    return AudioResponse.model_validate(audio)


@router.delete("/{audio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_audio_file(
    audio_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete an audio file (Admin only)."""
    audio = db.query(Audio).filter(Audio.id == audio_id).first()
    
    if not audio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    
    db.delete(audio)
    db.commit()
    
    return None


@router.post("/{audio_id}/download", response_model=AudioDownloadResponse)
async def increment_download_count(audio_id: str, db: Session = Depends(get_db)):
    """Increment download counter for an audio file."""
    audio = db.query(Audio).filter(Audio.id == audio_id).first()
    
    if not audio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    
    audio.downloads += 1
    db.commit()
    
    return AudioDownloadResponse(
        message="Download count incremented",
        download_count=audio.downloads
    )
