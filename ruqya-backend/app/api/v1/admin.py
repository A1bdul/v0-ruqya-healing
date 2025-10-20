from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Optional

from app.database import get_db
from app.models.user import User, UserRole
from app.models.order import Order, OrderStatus
from app.models.appointment import Appointment, AppointmentStatus
from app.models.product import Product
from app.models.article import Article
from app.models.chat import ChatSession, ChatMessage, ChatStatus
from app.schemas.admin import DashboardStats, RevenueStats, AdminUserListResponse
from app.schemas.user import UserResponse, UserUpdateAdmin
from app.core.security import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get dashboard statistics (Admin only)."""
    # Count totals
    total_users = db.query(User).count()
    total_appointments = db.query(Appointment).count()
    total_orders = db.query(Order).count()
    total_products = db.query(Product).count()
    total_articles = db.query(Article).count()
    
    # Count pending/active items
    pending_appointments = db.query(Appointment).filter(
        Appointment.status == AppointmentStatus.PENDING
    ).count()
    
    active_chats = db.query(ChatSession).filter(
        ChatSession.status == ChatStatus.ACTIVE
    ).count()
    
    # Get recent orders (last 5)
    from app.schemas.order import OrderSummaryResponse
    recent_orders = db.query(Order).order_by(
        Order.created_at.desc()
    ).limit(5).all()
    
    # Get recent appointments (last 5)
    from app.schemas.appointment import AppointmentResponse
    recent_appointments = db.query(Appointment).order_by(
        Appointment.created_at.desc()
    ).limit(5).all()
    
    # Calculate revenue
    now = datetime.utcnow()
    today_start = datetime(now.year, now.month, now.day)
    week_start = now - timedelta(days=now.weekday())
    month_start = datetime(now.year, now.month, 1)
    year_start = datetime(now.year, 1, 1)
    
    revenue_today = db.query(func.sum(Order.total_amount)).filter(
        Order.created_at >= today_start,
        Order.status != OrderStatus.CANCELLED
    ).scalar() or 0.0
    
    revenue_week = db.query(func.sum(Order.total_amount)).filter(
        Order.created_at >= week_start,
        Order.status != OrderStatus.CANCELLED
    ).scalar() or 0.0
    
    revenue_month = db.query(func.sum(Order.total_amount)).filter(
        Order.created_at >= month_start,
        Order.status != OrderStatus.CANCELLED
    ).scalar() or 0.0
    
    revenue_year = db.query(func.sum(Order.total_amount)).filter(
        Order.created_at >= year_start,
        Order.status != OrderStatus.CANCELLED
    ).scalar() or 0.0
    
    return DashboardStats(
        total_users=total_users,
        total_appointments=total_appointments,
        total_orders=total_orders,
        total_products=total_products,
        total_articles=total_articles,
        pending_appointments=pending_appointments,
        active_chats=active_chats,
        recent_orders=[OrderSummaryResponse.model_validate(o) for o in recent_orders],
        recent_appointments=[AppointmentResponse.model_validate(a) for a in recent_appointments],
        revenue=RevenueStats(
            today=revenue_today,
            this_week=revenue_week,
            this_month=revenue_month,
            this_year=revenue_year
        )
    )


@router.get("/users", response_model=AdminUserListResponse)
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    role: Optional[UserRole] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all users with filtering (Admin only)."""
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    total = query.count()
    users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    
    return AdminUserListResponse(
        total=total,
        items=[UserResponse.model_validate(u) for u in users]
    )


@router.patch("/users/{user_id}", response_model=UserResponse)
async def update_user_admin(
    user_id: str,
    user_data: UserUpdateAdmin,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update user role or status (Admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent admin from deactivating themselves
    if user.id == current_user.id and user_data.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account"
        )
    
    # Update fields
    update_data = user_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return UserResponse.model_validate(user)
