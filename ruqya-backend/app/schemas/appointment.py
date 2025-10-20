from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.appointment import AppointmentStatus
from app.schemas.service import ServiceResponse
from app.schemas.user import UserResponse


class AppointmentBase(BaseModel):
    service_id: str
    appointment_date: datetime
    user_name: str = Field(..., min_length=1, max_length=200)
    user_email: EmailStr
    user_phone: Optional[str] = None
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    appointment_date: Optional[datetime] = None
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None


class AppointmentResponse(AppointmentBase):
    id: str
    user_id: str
    status: AppointmentStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class AppointmentDetailResponse(AppointmentResponse):
    user: Optional[UserResponse] = None
    service: Optional[ServiceResponse] = None
    
    model_config = ConfigDict(from_attributes=True)


class AppointmentListResponse(BaseModel):
    total: int
    items: list[AppointmentDetailResponse]


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus
