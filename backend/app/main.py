from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, reports, chat

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for ReportSaathi - Medical Laboratory Report Explainer"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Reports"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["Report Chat"])

@app.get("/")
def root():
    return {
        "message": "Welcome to ReportSaathi API. Visit /docs for interactive Swagger API documentation.",
        "version": settings.VERSION
    }
