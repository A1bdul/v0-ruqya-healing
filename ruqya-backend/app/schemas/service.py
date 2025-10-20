from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class ServiceBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    icon: Optional[str] = None
    duration: int = Field(..., gt=0, description="Duration in minutes")
    price: float = Field(..., ge=0, description="Price must be non-negative")


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    icon: Optional[str] = None
    duration: Optional[int] = Field(None, gt=0)
    price: Optional[float] = Field(None, ge=0)
    is_active: Optional[bool] = None


class ServiceResponse(ServiceBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class ServiceListResponse(BaseModel):
    total: int
    items: list[ServiceResponse]
