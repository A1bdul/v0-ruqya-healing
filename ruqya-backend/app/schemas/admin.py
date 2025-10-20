from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from app.schemas.order import OrderSummaryResponse
from app.schemas.appointment import AppointmentResponse
from app.schemas.user import UserResponse


class RevenueStats(BaseModel):
    today: float
    this_week: float
    this_month: float
    this_year: float


class DashboardStats(BaseModel):
    total_users: int
    total_appointments: int
    total_orders: int
    total_products: int
    total_articles: int
    pending_appointments: int
    active_chats: int
    recent_orders: List[OrderSummaryResponse]
    recent_appointments: List[AppointmentResponse]
    revenue: RevenueStats


class AdminUserListResponse(BaseModel):
    total: int
    items: List[UserResponse]
