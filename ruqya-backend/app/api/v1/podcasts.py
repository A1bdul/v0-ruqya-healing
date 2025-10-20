from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from app.database import get_db
from app.models.podcast import Podcast
from app.models.user import User
from app.schemas.podcast import (
    PodcastCreate,
    PodcastUpdate,
    PodcastResponse,
    PodcastListResponse,
)
from app.core.security import get_current_admin_user

router = APIRouter(prefix="/podcasts", tags=["Podcasts"])


@router.get("", response_model=PodcastListResponse)
async def get_podcasts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    is_published: Optional[bool] = Query(True),
    db: Session = Depends(get_db)
):
    """Get all podcasts with optional filtering."""
    query = db.query(Podcast)
    
    if is_published is not None:
        query = query.filter(Podcast.is_published == is_published)
    
    total = query.count()
    podcasts = query.order_by(Podcast.published_at.desc()).offset(skip).limit(limit).all()
    
    return PodcastListResponse(
        total=total,
        items=[PodcastResponse.model_validate(p) for p in podcasts]
    )


@router.post("", response_model=PodcastResponse, status_code=status.HTTP_201_CREATED)
async def create_podcast(
    podcast_data: PodcastCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new podcast (Admin only)."""
    new_podcast = Podcast(
        id=str(uuid.uuid4()),
        **podcast_data.model_dump()
    )
    
    db.add(new_podcast)
    db.commit()
    db.refresh(new_podcast)
    
    return PodcastResponse.model_validate(new_podcast)


@router.get("/{podcast_id}", response_model=PodcastResponse)
async def get_podcast(podcast_id: str, db: Session = Depends(get_db)):
    """Get a specific podcast by ID."""
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    
    if not podcast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast not found"
        )
    
    return PodcastResponse.model_validate(podcast)


@router.patch("/{podcast_id}", response_model=PodcastResponse)
async def update_podcast(
    podcast_id: str,
    podcast_data: PodcastUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a podcast (Admin only)."""
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    
    if not podcast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast not found"
        )
    
    # Update fields
    update_data = podcast_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(podcast, field, value)
    
    db.commit()
    db.refresh(podcast)
    
    return PodcastResponse.model_validate(podcast)


@router.delete("/{podcast_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_podcast(
    podcast_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a podcast (Admin only)."""
    podcast = db.query(Podcast).filter(Podcast.id == podcast_id).first()
    
    if not podcast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast not found"
        )
    
    db.delete(podcast)
    db.commit()
    
    return None
