from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Audio(Base):
    __tablename__ = "audio_files"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    reciter = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False, index=True)
    duration = Column(Integer, nullable=False)  # in seconds
    audio_url = Column(String, nullable=False)
    downloads = Column(Integer, default=0, nullable=False)
    is_published = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
