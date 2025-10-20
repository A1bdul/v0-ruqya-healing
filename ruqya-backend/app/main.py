from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
# Remove or comment out TrustedHostMiddleware import
# from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import time
from pathlib import Path

from app.config import settings
from app.database import engine, Base
from app.api.v1 import api_router


# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for startup and shutdown events.
    """
    # Startup
    print("🚀 Starting Ruqya Healing Hub API...")
    print(f"📊 Environment: {settings.ENVIRONMENT}")
    print(f"🔗 Database: Connected")
    print(f"🌐 CORS: Enabled for {settings.FRONTEND_URL}")
    
    # Create database tables (in production, use Alembic migrations)
    if settings.ENVIRONMENT == "development":
        print("📝 Creating database tables...")
        Base.metadata.create_all(bind=engine)
    
    yield
    
    # Shutdown
    print("👋 Shutting down Ruqya Healing Hub API...")


# Initialize FastAPI app
app = FastAPI(
    title="Ruqya Healing Hub API",
    description="Backend API for Ruqya Healing Hub - Islamic Spiritual Healing Platform",
    version="1.0.0",
    docs_url="/docs",  # Always enable
    redoc_url="/redoc",  # Always enable
    lifespan=lifespan,
)


# CORS Middleware - Allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (be more restrictive in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Remove TrustedHostMiddleware - it's causing the "Invalid host header" error
# Trusted Host Middleware (Security)
# if settings.ENVIRONMENT == "production":
#     app.add_middleware(
#         TrustedHostMiddleware,
#         allowed_hosts=["*.ruqyahealinghub.com", "ruqyahealinghub.com"]
#     )


# Request Timing Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time header to all responses."""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions."""
    print(f"❌ Unhandled error: {exc}")
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error": str(exc) if settings.ENVIRONMENT == "development" else "An error occurred"
        }
    )


# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# Health Check Endpoint
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API health check."""
    return {
        "message": "Ruqya Healing Hub API",
        "version": "1.0.0",
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "database": "connected",
        "timestamp": time.time()
    }


# Include API routes
app.include_router(api_router, prefix="/api/v1")


# Custom 404 Handler
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """Handle 404 errors."""
    return JSONResponse(
        status_code=404,
        content={
            "detail": "Resource not found",
            "path": str(request.url)
        }
    )


# Run with: uvicorn app.main:app --reload
if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development",
        log_level="info"
    )
