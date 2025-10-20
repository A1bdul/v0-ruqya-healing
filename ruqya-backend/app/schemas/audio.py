from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class AudioBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    reciter: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    category: str = Field(..., min_length=1, max_length=100)
    duration: int = Field(..., gt=0, description="Duration in seconds")
    audio_url: str


class AudioCreate(AudioBase):
    pass


class AudioUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    reciter: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    duration: Optional[int] = Field(None, gt=0)
    audio_url: Optional[str] = None
    is_published: Optional[bool] = None


class AudioResponse(AudioBase):
    id: str
    downloads: int
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class AudioListResponse(BaseModel):
    total: int
    items: list[AudioResponse]


class AudioDownloadResponse(BaseModel):
    message: str
    download_count: int
