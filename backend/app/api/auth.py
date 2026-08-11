from datetime import timedelta

from fastapi import APIRouter, Request, Response

from app.api.deps import CurrentUser, DbDep
from app.config import settings
from app.core.exceptions import Unauthorized
from app.schemas.auth import LoginRequest, MeResponse, RegisterRequest, TokenResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])

REFRESH_COOKIE = "reuven_refresh"


@router.post("/register", response_model=MeResponse, status_code=201)
async def register(req: RegisterRequest, db: DbDep):
    usuario = await auth_service.register(req, db)
    return MeResponse.model_validate(usuario)


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: DbDep, response: Response):
    access, raw_refresh = await auth_service.login(req, db)
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=raw_refresh,
        httponly=True,
        secure=settings.is_production,
        samesite="none" if settings.is_production else "lax",
        max_age=int(timedelta(days=settings.refresh_token_expire_days).total_seconds()),
        path="/auth/refresh",
    )
    return TokenResponse(access_token=access)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(request_obj: Request, db: DbDep, response: Response):
    raw = request_obj.cookies.get(REFRESH_COOKIE)
    if not raw:
        raise Unauthorized("No hay refresh token")
    access, new_raw = await auth_service.refresh(raw, db)
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=new_raw,
        httponly=True,
        secure=settings.is_production,
        samesite="none" if settings.is_production else "lax",
        max_age=int(timedelta(days=settings.refresh_token_expire_days).total_seconds()),
        path="/auth/refresh",
    )
    return TokenResponse(access_token=access)


@router.post("/logout", status_code=204)
async def logout(response: Response):
    response.delete_cookie(key=REFRESH_COOKIE, path="/auth/refresh")


@router.get("/me", response_model=MeResponse)
async def me(current_user: CurrentUser):
    return MeResponse.model_validate(current_user)
