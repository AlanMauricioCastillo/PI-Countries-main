import pytest

pytestmark = pytest.mark.asyncio


class TestCreateFavorite:
    async def test_success(self, client, auth_headers, seed_countries):
        resp = await client.post("/favorites/USA", headers=auth_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["country_id"] == "USA"
        assert "created_at" in data

    async def test_no_auth(self, client, seed_countries):
        resp = await client.post("/favorites/USA")
        assert resp.status_code == 401

    async def test_duplicate(self, client, auth_headers, seed_countries):
        await client.post("/favorites/USA", headers=auth_headers)
        resp = await client.post("/favorites/USA", headers=auth_headers)
        assert resp.status_code == 409

    async def test_country_not_found(self, client, auth_headers):
        resp = await client.post("/favorites/XYZ", headers=auth_headers)
        assert resp.status_code == 404

    async def test_multiple_countries(self, client, auth_headers, seed_countries):
        resp1 = await client.post("/favorites/USA", headers=auth_headers)
        resp2 = await client.post("/favorites/ARG", headers=auth_headers)
        assert resp1.status_code == 201
        assert resp2.status_code == 201


class TestListFavorites:
    async def test_list(self, client, auth_headers, seed_countries):
        await client.post("/favorites/USA", headers=auth_headers)
        await client.post("/favorites/ARG", headers=auth_headers)

        resp = await client.get("/favorites", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) == 2
        country_ids = {c["id"] for c in data}
        assert country_ids == {"USA", "ARG"}

    async def test_no_auth(self, client):
        resp = await client.get("/favorites")
        assert resp.status_code == 401

    async def test_empty(self, client, auth_headers):
        resp = await client.get("/favorites", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json() == []

    async def test_other_user_favorites_not_visible(self, client, auth_headers, other_auth_headers, seed_countries):
        await client.post("/favorites/USA", headers=auth_headers)
        resp = await client.get("/favorites", headers=other_auth_headers)
        assert resp.status_code == 200
        assert resp.json() == []


class TestDeleteFavorite:
    async def test_success(self, client, auth_headers, seed_countries):
        await client.post("/favorites/USA", headers=auth_headers)
        resp = await client.delete("/favorites/USA", headers=auth_headers)
        assert resp.status_code == 204

    async def test_not_found(self, client, auth_headers):
        resp = await client.delete("/favorites/XYZ", headers=auth_headers)
        assert resp.status_code == 404

    async def test_no_auth(self, client):
        resp = await client.delete("/favorites/USA")
        assert resp.status_code == 401

    async def test_double_delete(self, client, auth_headers, seed_countries):
        await client.post("/favorites/USA", headers=auth_headers)
        await client.delete("/favorites/USA", headers=auth_headers)
        resp = await client.delete("/favorites/USA", headers=auth_headers)
        assert resp.status_code == 404
