from fastapi import APIRouter
from app.api.v1 import (
    auth,
    services,
    appointments,
    articles,
    podcasts,
    audio,
    products,
    orders,
    chat,
    upload,
    admin,
)

api_router = APIRouter()

# Include all routers
api_router.include_router(auth.router)
api_router.include_router(services.router)
api_router.include_router(appointments.router)
api_router.include_router(articles.router)
api_router.include_router(podcasts.router)
api_router.include_router(audio.router)
api_router.include_router(products.router)
api_router.include_router(orders.router)
api_router.include_router(chat.router)
api_router.include_router(upload.router)
api_router.include_router(admin.router)
