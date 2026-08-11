import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_and_login(client: AsyncClient):
    # Registro
    r = await client.post("/auth/register", json={
        "email": "tutor@test.com",
        "password": "password123",
        "nombre": "Tutor Test",
        "rol": "tutor",
        "relacion": "madre",
    })
    assert r.status_code == 201
    data = r.json()
    assert data["email"] == "tutor@test.com"
    assert data["rol"] == "tutor"

    # Login
    r = await client.post("/auth/login", json={
        "email": "tutor@test.com",
        "password": "password123",
    })
    assert r.status_code == 200
    tokens = r.json()
    assert "access_token" in tokens

    # Me
    r = await client.get("/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"})
    assert r.status_code == 200
    assert r.json()["nombre"] == "Tutor Test"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    await client.post("/auth/register", json={
        "email": "bad@test.com",
        "password": "correct123",
        "nombre": "X",
        "rol": "tutor",
    })
    r = await client.post("/auth/login", json={"email": "bad@test.com", "password": "wrong"})
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    body = {"email": "dup@test.com", "password": "pass1234", "nombre": "A", "rol": "tutor"}
    await client.post("/auth/register", json=body)
    r = await client.post("/auth/register", json=body)
    assert r.status_code == 409


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    r = await client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
