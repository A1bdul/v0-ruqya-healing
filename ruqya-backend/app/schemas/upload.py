from pydantic import BaseModel, Field
from typing import Optional


class FileUploadResponse(BaseModel):
    url: str
    filename: str
    size: int
    duration: Optional[int] = None  # For audio/video files
    
    
class ImageUploadResponse(FileUploadResponse):
    width: Optional[int] = None
    height: Optional[int] = None


class AudioUploadResponse(FileUploadResponse):
    duration: int  # Required for audio
    format: str
