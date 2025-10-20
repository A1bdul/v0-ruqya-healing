from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
import uuid
from slugify import slugify
from datetime import datetime, timezone

from app.database import get_db
from app.models.article import Article
from app.models.user import User
from app.schemas.article import (
    ArticleCreate,
    ArticleUpdate,
    ArticleResponse,
    ArticleSummaryResponse,
    ArticleListResponse,
    ArticleRelatedResponse,
)
from app.core.security import get_current_admin_user

router = APIRouter(prefix="/articles", tags=["Articles"])


@router.get("", response_model=ArticleListResponse)
async def get_articles(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    is_published: Optional[bool] = Query(None),  # None means fetch all, True/False filters
    db: Session = Depends(get_db)
):
    """Get all articles with optional filtering."""
    query = db.query(Article)
    
    if is_published is not None:
        query = query.filter(Article.is_published == is_published)
    
    if category:
        query = query.filter(Article.category == category)
    
    total = query.count()
    articles = query.order_by(Article.published_at.desc()).offset(skip).limit(limit).all()
    
    return ArticleListResponse(
        total=total,
        items=[ArticleSummaryResponse.model_validate(a) for a in articles]
    )


@router.get("/slug/{slug}", response_model=ArticleResponse)
async def get_article_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get an article by slug."""
    article = db.query(Article).filter(Article.slug == slug).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    if not article.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    return ArticleResponse.model_validate(article)


@router.get("/category/{category}", response_model=ArticleListResponse)
async def get_articles_by_category(
    category: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get articles by category."""
    query = db.query(Article).filter(
        Article.category == category,
        Article.is_published == True
    )
    
    total = query.count()
    articles = query.order_by(Article.published_at.desc()).offset(skip).limit(limit).all()
    
    return ArticleListResponse(
        total=total,
        items=[ArticleSummaryResponse.model_validate(a) for a in articles]
    )


@router.post("", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(
    article_data: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new article (Admin only)."""
    # Generate slug from title
    base_slug = slugify(article_data.title)
    slug = base_slug
    counter = 1
    
    # Ensure slug is unique
    while db.query(Article).filter(Article.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    # Create article data dict
    article_dict = article_data.model_dump()
    
    # Set published_at if the article is being published
    is_published = article_dict.get('is_published', False)
    published_at = datetime.now(timezone.utc) if is_published else None
    
    new_article = Article(
        id=str(uuid.uuid4()),
        slug=slug,
        is_published=is_published,
        published_at=published_at,
        **{k: v for k, v in article_dict.items() if k != 'is_published'}
    )
    
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    
    return ArticleResponse.model_validate(new_article)


@router.patch("/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: str,
    article_data: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update an article (Admin only)."""
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Update fields
    update_data = article_data.model_dump(exclude_unset=True)
    
    # If title is being updated, regenerate slug
    if "title" in update_data:
        base_slug = slugify(update_data["title"])
        slug = base_slug
        counter = 1
        
        while db.query(Article).filter(
            Article.slug == slug,
            Article.id != article_id
        ).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        article.slug = slug
    
    # Handle published_at when article is being published
    if "is_published" in update_data:
        if update_data["is_published"] and not article.is_published:
            # Article is being published for the first time
            article.published_at = datetime.now(timezone.utc)
        elif not update_data["is_published"]:
            # Article is being unpublished
            article.published_at = None
    
    # Apply other updates
    for field, value in update_data.items():
        setattr(article, field, value)
    
    db.commit()
    db.refresh(article)
    
    return ArticleResponse.model_validate(article)


@router.put("/{article_id}", response_model=ArticleResponse)
async def replace_article(
    article_id: str,
    article_data: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Replace/update an article (Admin only). Alias for PATCH for compatibility."""
    return await update_article(article_id, article_data, db, current_user)


@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete an article (Admin only)."""
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    db.delete(article)
    db.commit()
    
    return None


@router.get("/{article_id}/related", response_model=list[ArticleRelatedResponse])
async def get_related_articles(
    article_id: str,
    limit: int = Query(3, ge=1, le=10),
    db: Session = Depends(get_db)
):
    """Get related articles based on category."""
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    related = db.query(Article).filter(
        Article.category == article.category,
        Article.id != article_id,
        Article.is_published == True
    ).limit(limit).all()
    
    return [ArticleRelatedResponse.model_validate(a) for a in related]
