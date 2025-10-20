from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.chat import ChatStatus


class ChatSessionBase(BaseModel):
    user_name: str = Field(..., min_length=1, max_length=200)
    user_email: EmailStr


class ChatSessionCreate(ChatSessionBase):
    pass


class ChatSessionResponse(ChatSessionBase):
    id: str
    status: ChatStatus
    start_time: datetime
    last_activity: datetime
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ChatSessionWithUnreadResponse(ChatSessionResponse):
    """Session with unread message count"""
    unread_count: int = 0
    
    model_config = ConfigDict(from_attributes=True)


class ChatSessionListResponse(BaseModel):
    total: int
    items: list[ChatSessionWithUnreadResponse]


class ChatSessionCloseRequest(BaseModel):
    session_id: str


class ChatMessageBase(BaseModel):
    message: str = Field(..., min_length=1)
    sender: str = Field(..., pattern="^(user|admin)$")


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessageResponse(ChatMessageBase):
    id: str
    session_id: str
    read: bool
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ChatMessageListResponse(BaseModel):
    total: int
    items: list[ChatMessageResponse]


class UnreadCountResponse(BaseModel):
    total_unread: int


# WebSocket message types
class WSMessage(BaseModel):
    """WebSocket message from client"""
    type: str = Field(..., pattern="^(message|typing)$")
    message: Optional[str] = None
    sender: Optional[str] = Field(None, pattern="^(user|admin)$")
    is_typing: Optional[bool] = None


class WSMessageResponse(BaseModel):
    """WebSocket message to client"""
    type: str  # message, typing, status, close
    id: Optional[str] = None
    session_id: Optional[str] = None
    sender: Optional[str] = None
    message: Optional[str] = None
    timestamp: Optional[int] = None
    read: Optional[bool] = None
    is_typing: Optional[bool] = None
    users_online: Optional[List[str]] = None
    reason: Optional[str] = None
