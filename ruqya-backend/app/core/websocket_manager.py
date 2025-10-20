from typing import Dict, List
from fastapi import WebSocket


class ConnectionManager:
    """Manager for WebSocket connections."""
    
    def __init__(self):
        # Store active connections: {session_id: [websocket1, websocket2, ...]}
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, session_id: str):
        """Accept a new WebSocket connection."""
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        self.active_connections[session_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, session_id: str):
        """Remove a WebSocket connection."""
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send a message to a specific WebSocket."""
        await websocket.send_json(message)
    
    async def broadcast_to_session(self, message: dict, session_id: str):
        """Broadcast a message to all connections in a session."""
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                await connection.send_json(message)
    
    def is_user_online(self, session_id: str) -> bool:
        """Check if any user is online in a session."""
        return session_id in self.active_connections and len(self.active_connections[session_id]) > 0
    
    def get_active_sessions(self) -> List[str]:
        """Get list of all active session IDs."""
        return list(self.active_connections.keys())


# Global instance
manager = ConnectionManager()
