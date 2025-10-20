from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import Optional
import uuid
import os
from pathlib import Path

from app.models.user import User
from app.schemas.upload import FileUploadResponse, ImageUploadResponse, AudioUploadResponse
from app.core.security import get_current_admin_user

router = APIRouter(prefix="/upload", tags=["File Upload"])

# Configure upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"}
ALLOWED_AUDIO_TYPES = {"audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB


def save_upload_file(upload_file: UploadFile, directory: str) -> dict:
    """Save uploaded file and return file info."""
    # Generate unique filename
    file_extension = Path(upload_file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # Create directory
    upload_path = UPLOAD_DIR / directory
    upload_path.mkdir(exist_ok=True)
    
    # Save file
    file_path = upload_path / unique_filename
    with open(file_path, "wb") as buffer:
        content = upload_file.file.read()
        buffer.write(content)
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    # Return file URL (adjust this based on your setup)
    file_url = f"/uploads/{directory}/{unique_filename}"
    
    return {
        "url": file_url,
        "filename": unique_filename,
        "size": file_size
    }


@router.post("/image", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_admin_user)
):
    """Upload an image file (Admin only)."""
    # Validate file type
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )
    
    # Check file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    # Save file
    file_info = save_upload_file(file, "images")
    
    return ImageUploadResponse(**file_info)


@router.post("/audio", response_model=AudioUploadResponse)
async def upload_audio(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_admin_user)
):
    """Upload an audio file (Admin only)."""
    # Validate file type
    if file.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_AUDIO_TYPES)}"
        )
    
    # Check file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    # Save file
    file_info = save_upload_file(file, "audio")
    
    # TODO: Extract audio duration using mutagen or similar library
    duration = 0  # Placeholder
    
    return AudioUploadResponse(
        **file_info,
        duration=duration,
        format=file.content_type
    )


@router.post("/podcast", response_model=AudioUploadResponse)
async def upload_podcast(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_admin_user)
):
    """Upload a podcast file (Admin only)."""
    # Same as audio upload but in different directory
    if file.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_AUDIO_TYPES)}"
        )
    
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    file_info = save_upload_file(file, "podcasts")
    duration = 0  # Placeholder
    
    return AudioUploadResponse(
        **file_info,
        duration=duration,
        format=file.content_type
    )
