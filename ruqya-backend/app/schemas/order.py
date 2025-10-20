from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.order import OrderStatus
from app.schemas.product import ProductResponse


class OrderItemBase(BaseModel):
    product_id: str
    quantity: int = Field(..., gt=0, description="Quantity must be positive")


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(OrderItemBase):
    id: str
    order_id: str
    price: float
    product: Optional[ProductResponse] = None
    
    model_config = ConfigDict(from_attributes=True)


class OrderBase(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=200)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=1)
    shipping_address: str = Field(..., min_length=1)
    payment_method: str = Field(..., min_length=1)


class OrderCreate(OrderBase):
    items: List[OrderItemCreate] = Field(..., min_items=1)


class OrderUpdate(BaseModel):
    shipping_address: Optional[str] = None
    payment_method: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderResponse(OrderBase):
    id: str
    order_number: str
    user_id: Optional[str] = None
    total_amount: float
    status: OrderStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []
    
    model_config = ConfigDict(from_attributes=True)


class OrderSummaryResponse(BaseModel):
    """Abbreviated order for list views"""
    id: str
    order_number: str
    customer_name: str
    customer_email: str
    total_amount: float
    status: OrderStatus
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class OrderListResponse(BaseModel):
    total: int
    items: list[OrderSummaryResponse]
