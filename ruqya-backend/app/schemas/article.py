from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class ArticleBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    content: str = Field(..., min_length=1)
    excerpt: Optional[str] = None
    category: str = Field(..., min_length=1, max_length=100)
    author: str = Field(..., min_length=1, max_length=200)
    read_time: int = Field(..., gt=0, description="Reading time in minutes")


class ArticleCreate(ArticleBase):
    """Schema for creating a new article."""
    is_published: bool = Field(default=False, description="Whether the article should be published immediately")


class ArticleUpdate(BaseModel):
    """Schema for updating an existing article."""
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    content: Optional[str] = Field(None, min_length=1)
    excerpt: Optional[str] = None
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    author: Optional[str] = Field(None, min_length=1, max_length=200)
    read_time: Optional[int] = Field(None, gt=0)
    is_published: Optional[bool] = None


class ArticleResponse(ArticleBase):
    """Schema for article response."""
    id: str
    slug: str
    is_published: bool
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class ArticleSummaryResponse(BaseModel):
    """Abbreviated article for list views."""
    id: str
    title: str
    slug: str
    excerpt: Optional[str] = None
    category: str
    author: str
    read_time: int
    is_published: bool
    published_at: Optional[datetime] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ArticleListResponse(BaseModel):
    """Response schema for paginated article lists."""
    total: int
    items: list[ArticleSummaryResponse]


class ArticleRelatedResponse(BaseModel):
    """Minimal article info for related articles."""
    id: str
    title: str
    slug: str
    excerpt: Optional[str] = None
    category: str
    
    model_config = ConfigDict(from_attributes=True)
