from fastapi import APIRouter, Depends, HTTPException, status, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import uuid
import time
import random

from app.database import get_db
from app.models.chat import ChatSession, ChatMessage, ChatStatus
from app.models.user import User
from app.schemas.chat import (
    ChatSessionCreate,
    ChatSessionResponse,
    ChatSessionWithUnreadResponse,
    ChatSessionListResponse,
    ChatMessageCreate,
    ChatMessageResponse,
    ChatMessageListResponse,
    UnreadCountResponse,
    WSMessage,
    WSMessageResponse,
)
from app.core.security import get_current_admin_user, verify_websocket_token
from app.core.websocket_manager import manager

router = APIRouter(prefix="/chat", tags=["Chat"])


# REST Endpoints

@router.post("/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_session(
    session_data: ChatSessionCreate,
    db: Session = Depends(get_db)
):
    """Create a new chat session."""
    new_session = ChatSession(
        id=str(uuid.uuid4()),
        user_name=session_data.user_name,
        user_email=session_data.user_email,
        status=ChatStatus.ACTIVE
    )
    
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    return ChatSessionResponse.model_validate(new_session)


@router.get("/sessions", response_model=ChatSessionListResponse)
async def get_chat_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[ChatStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all chat sessions (Admin only)."""
    query = db.query(ChatSession)
    
    if status:
        query = query.filter(ChatSession.status == status)
    
    total = query.count()
    sessions = query.order_by(ChatSession.last_activity.desc()).offset(skip).limit(limit).all()
    
    # Calculate unread count for each session
    session_responses = []
    for session in sessions:
        unread_count = db.query(ChatMessage).filter(
            ChatMessage.session_id == session.id,
            ChatMessage.sender == "user",
            ChatMessage.read == False
        ).count()
        
        session_dict = ChatSessionResponse.model_validate(session).model_dump()
        session_dict["unread_count"] = unread_count
        session_responses.append(ChatSessionWithUnreadResponse(**session_dict))
    
    return ChatSessionListResponse(
        total=total,
        items=session_responses
    )


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_chat_session(
    session_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific chat session."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    return ChatSessionResponse.model_validate(session)


@router.get("/sessions/{session_id}/messages", response_model=ChatMessageListResponse)
async def get_chat_messages(
    session_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Get messages for a chat session."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    query = db.query(ChatMessage).filter(ChatMessage.session_id == session_id)
    total = query.count()
    messages = query.order_by(ChatMessage.timestamp.asc()).offset(skip).limit(limit).all()
    
    return ChatMessageListResponse(
        total=total,
        items=[ChatMessageResponse.model_validate(m) for m in messages]
    )


@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_message(
    session_id: str,
    message_data: ChatMessageCreate,
    db: Session = Depends(get_db)
):
    """Create a new message (REST fallback when WebSocket unavailable)."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    if session.status == ChatStatus.CLOSED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chat session is closed"
        )
    
    # Create message
    new_message = ChatMessage(
        id=f"msg_{int(time.time())}_{random.randint(1000, 9999)}",
        session_id=session_id,
        sender=message_data.sender,
        message=message_data.message,
        read=False
    )
    
    db.add(new_message)
    
    # Update session last_activity
    session.last_activity = func.now()
    
    db.commit()
    db.refresh(new_message)
    
    # Try to broadcast via WebSocket if connection exists
    try:
        await manager.broadcast_to_session({
            "type": "message",
            "id": new_message.id,
            "session_id": session_id,
            "sender": message_data.sender,
            "message": message_data.message,
            "timestamp": int(new_message.timestamp.timestamp()),
            "read": False
        }, session_id)
    except:
        pass  # WebSocket not connected, message saved to DB
    
    return ChatMessageResponse.model_validate(new_message)


@router.patch("/sessions/{session_id}/close", response_model=ChatSessionResponse)
async def close_chat_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Close a chat session (Admin only)."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    session.status = ChatStatus.CLOSED
    db.commit()
    db.refresh(session)
    
    # Notify via WebSocket
    try:
        await manager.broadcast_to_session({
            "type": "close",
            "reason": "Session ended by admin"
        }, session_id)
    except:
        pass
    
    return ChatSessionResponse.model_validate(session)


@router.patch("/sessions/{session_id}/mark-read", response_model=ChatSessionResponse)
async def mark_messages_as_read(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Mark all messages in a session as read (Admin only)."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    # Mark all user messages as read
    db.query(ChatMessage).filter(
        ChatMessage.session_id == session_id,
        ChatMessage.sender == "user",
        ChatMessage.read == False
    ).update({"read": True})
    
    db.commit()
    
    return ChatSessionResponse.model_validate(session)


@router.get("/unread-count", response_model=UnreadCountResponse)
async def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get total unread message count across all sessions (Admin only)."""
    total_unread = db.query(ChatMessage).filter(
        ChatMessage.sender == "user",
        ChatMessage.read == False
    ).count()
    
    return UnreadCountResponse(total_unread=total_unread)


# WebSocket Endpoint

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: str,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    """WebSocket endpoint for real-time chat."""
    # Validate JWT token
    user = await verify_websocket_token(token, db)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    # Verify session exists
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    # Connect
    await manager.connect(websocket, session_id)
    
    try:
        # Send online status
        await manager.broadcast_to_session({
            "type": "status",
            "users_online": ["user", "admin"] if manager.is_user_online(session_id) else ["user"]
        }, session_id)
        
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            # Validate message structure
            try:
                ws_message = WSMessage(**data)
            except Exception:
                continue
            
            if ws_message.type == "message":
                # Save message to database
                new_message = ChatMessage(
                    id=f"msg_{int(time.time())}_{random.randint(1000, 9999)}",
                    session_id=session_id,
                    sender=ws_message.sender,
                    message=ws_message.message,
                    read=False
                )
                db.add(new_message)
                
                # Update session last_activity
                session.last_activity = func.now()
                
                db.commit()
                db.refresh(new_message)
                
                # Broadcast to all connected clients in this session
                await manager.broadcast_to_session({
                    "type": "message",
                    "id": new_message.id,
                    "session_id": session_id,
                    "sender": ws_message.sender,
                    "message": ws_message.message,
                    "timestamp": int(new_message.timestamp.timestamp()),
                    "read": False
                }, session_id)
            
            elif ws_message.type == "typing":
                # Broadcast typing indicator (don't save to DB)
                await manager.broadcast_to_session({
                    "type": "typing",
                    "sender": ws_message.sender,
                    "is_typing": ws_message.is_typing
                }, session_id)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        # Notify others user disconnected
        await manager.broadcast_to_session({
            "type": "status",
            "users_online": ["user"] if manager.is_user_online(session_id) else []
        }, session_id)
    except Exception as e:
        manager.disconnect(websocket, session_id)
        print(f"WebSocket error: {e}")
