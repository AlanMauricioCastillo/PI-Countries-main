import pytest

from app.models import User
from app.security import hash_password

pytestmark = pytest.mark.asyncio


class TestRegister:
    async def test_success(self, client):
        resp = await client.post("/auth/register", json={
            "email": "newuser@test.com",
            "username": "newuser",
            "password": "StrongPass1",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == "newuser@test.com"
        assert data["username"] == "newuser"
        assert "id" in data
        assert data["is_active"] is True
        assert "password" not in data

    async def test_email_duplicate(self, client, db_session):
        user = User(
            email="dup@test.com", username="firstuser",
            hashed_password=hash_password("TestPass1"), is_active=True,
        )
        db_session.add(user)
        db_session.commit()

        resp = await client.post("/auth/register", json={
            "email": "dup@test.com",
            "username": "seconduser",
            "password": "TestPass1",
        })
        assert resp.status_code == 409
        detail = resp.json()["detail"].lower()
        assert "email" in detail or "already" in detail

    async def test_username_duplicate(self, client, db_session):
        user = User(
            email="first@test.com", username="dupuser",
            hashed_password=hash_password("TestPass1"), is_active=True,
        )
        db_session.add(user)
        db_session.commit()

        resp = await client.post("/auth/register", json={
            "email": "second@test.com",
            "username": "dupuser",
            "password": "TestPass1",
        })
        assert resp.status_code == 409
        detail = resp.json()["detail"].lower()
        assert "username" in detail or "already" in detail

    @pytest.mark.parametrize("password,reason", [
        ("weakpass1", "no uppercase"),
        ("WEAKPASS1", "no lowercase"),
        ("WeakPasss", "no digit"),
        ("Sh0rt!", "too short"),
    ])
    async def test_weak_password(self, client, password, reason):
        resp = await client.post("/auth/register", json={
            "email": f"{reason}@test.com",
            "username": f"user_{reason}",
            "password": password,
        })
        assert resp.status_code == 422

    @pytest.mark.parametrize("email", [
        "notanemail",
        "",
        "user@",
        "@domain.com",
        "user@.com",
    ])
    async def test_invalid_email(self, client, email):
        resp = await client.post("/auth/register", json={
            "email": email,
            "username": "validuser",
            "password": "StrongPass1",
        })
        assert resp.status_code == 422

    @pytest.mark.parametrize("username", [
        "ab",
        "user name",
        "user@name",
        "a" * 31,
        "",
    ])
    async def test_invalid_username(self, client, username):
        resp = await client.post("/auth/register", json={
            "email": "valid@test.com",
            "username": username,
            "password": "StrongPass1",
        })
        assert resp.status_code == 422


class TestLogin:
    async def test_success(self, client, db_session):
        user = User(
            email="login@test.com", username="loginuser",
            hashed_password=hash_password("StrongPass1"), is_active=True,
        )
        db_session.add(user)
        db_session.commit()

        resp = await client.post("/auth/login", json={
            "identifier": "loginuser",
            "password": "StrongPass1",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    async def test_login_by_email(self, client, db_session):
        user = User(
            email="login@test.com", username="loginuser",
            hashed_password=hash_password("StrongPass1"), is_active=True,
        )
        db_session.add(user)
        db_session.commit()

        resp = await client.post("/auth/login", json={
            "identifier": "login@test.com",
            "password": "StrongPass1",
        })
        assert resp.status_code == 200

    async def test_wrong_password(self, client, db_session):
        user = User(
            email="wrong@test.com", username="wronguser",
            hashed_password=hash_password("StrongPass1"), is_active=True,
        )
        db_session.add(user)
        db_session.commit()

        resp = await client.post("/auth/login", json={
            "identifier": "wronguser",
            "password": "WrongPass1",
        })
        assert resp.status_code == 401

    async def test_wrong_identifier(self, client):
        resp = await client.post("/auth/login", json={
            "identifier": "nonexistent",
            "password": "StrongPass1",
        })
        assert resp.status_code == 401

    async def test_inactive_user(self, client, db_session):
        user = User(
            email="inactive@test.com", username="inactiveuser",
            hashed_password=hash_password("StrongPass1"), is_active=False,
        )
        db_session.add(user)
        db_session.commit()

        resp = await client.post("/auth/login", json={
            "identifier": "inactiveuser",
            "password": "StrongPass1",
        })
        assert resp.status_code == 403


class TestMe:
    async def test_valid_token(self, client, auth_headers):
        resp = await client.get("/auth/me", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == "testuser@example.com"
        assert data["username"] == "testuser"
        assert "id" in data
        assert data["is_active"] is True

    async def test_no_token(self, client):
        resp = await client.get("/auth/me")
        assert resp.status_code == 401

    async def test_expired_token(self, client, expired_token):
        resp = await client.get("/auth/me", headers=expired_token)
        assert resp.status_code == 401

    async def test_invalid_token(self, client):
        resp = await client.get("/auth/me", headers={"Authorization": "Bearer invalid.jwt.token"})
        assert resp.status_code == 401

    async def test_inactive_user_token(self, client, inactive_auth_headers):
        resp = await client.get("/auth/me", headers=inactive_auth_headers)
        assert resp.status_code == 401
