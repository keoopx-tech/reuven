from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api import admin, auth, codigos, metricas, perfiles, profesional, vinculos
from app.config import settings
from app.database import engine
from app.models import *  # noqa: F401,F403  — importa todos los modelos para Alembic


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown
    await engine.dispose()


limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Reuven API",
    description="Backend de lectoescritura Reuven Feuerstein — Enseñamos a Pensar",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(perfiles.router)
app.include_router(codigos.router)
app.include_router(vinculos.router)
app.include_router(metricas.router)
app.include_router(profesional.router)
app.include_router(admin.router)


@app.get("/health", tags=["infra"])
async def health():
    return {"status": "ok", "version": "0.1.0"}
