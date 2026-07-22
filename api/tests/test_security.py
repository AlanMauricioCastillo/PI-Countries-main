import pytest

from app.models import User
from app.security import hash_password

pytestmark = pytest.mark.asyncio


class TestRateLimit:
    @pytest.mark.slow
    async def test_login_rate_limit(self, client, db_session):
        user = User(
            email="ratelimit@test.com", username="ratelimit",
            hashed_password=hash_password("TestPass1"), is_active=True,
        )
        db_session.add(user)
        db_session.commit()

        statuses = []
        for _ in range(10):
            resp = await client.post("/auth/login", json={
                "identifier": "ratelimit",
                "password": "TestPass1",
            })
            statuses.append(resp.status_code)

        assert 429 in statuses, f"Expected rate limit (429) after many login attempts, got: {statuses}"

    @pytest.mark.slow
    async def test_register_rate_limit(self, client):
        statuses = []
        for i in range(6):
            resp = await client.post("/auth/register", json={
                "email": f"ratelimit{i}@test.com",
                "username": f"ratelimit{i}",
                "password": "StrongPass1",
            })
            statuses.append(resp.status_code)

        assert 429 in statuses, f"Expected rate limit (429) after many register attempts, got: {statuses}"


class TestSecurityHeaders:
    async def test_security_headers_present(self, client):
        resp = await client.get("/countries")
        headers = resp.headers

        assert headers.get("x-content-type-options") == "nosniff"
        assert headers.get("x-frame-options") == "DENY"
        assert headers.get("referrer-policy") is not None

        csp = headers.get("content-security-policy")
        if csp:
            assert "default-src 'self'" in csp

    async def test_cors_headers(self, client):
        resp = await client.options(
            "/countries",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert resp.status_code == 200
        assert resp.headers.get("access-control-allow-origin") == "http://localhost:3000"
