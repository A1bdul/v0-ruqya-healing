from pydantic import BaseModel, Field, ConfigDict, HttpUrl
from typing import Optional
from datetime import datetime


class PodcastBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    description: str = Field(..., min_length=1)
    duration: int = Field(..., gt=0, description="Duration in seconds")
    audio_url: str
    cover_image: Optional[str] = None


class PodcastCreate(PodcastBase):
    pass


class PodcastUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    description: Optional[str] = Field(None, min_length=1)
    duration: Optional[int] = Field(None, gt=0)
    audio_url: Optional[str] = None
    cover_image: Optional[str] = None
    is_published: Optional[bool] = None


class PodcastResponse(PodcastBase):
    id: str
    is_published: bool
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class PodcastListResponse(BaseModel):
    total: int
    items: list[PodcastResponse]
