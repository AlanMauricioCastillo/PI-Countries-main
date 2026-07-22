import pytest

pytestmark = pytest.mark.asyncio


class TestCreateActivity:
    async def test_no_auth(self, client, seed_countries):
        resp = await client.post("/activity", json={
            "name": "Test",
            "difficulty": 3,
            "duration": 2,
            "season": ["summer"],
            "risk_level": 2,
            "country_ids": ["USA"],
        })
        assert resp.status_code == 401

    async def test_success(self, client, auth_headers, seed_countries):
        resp = await client.post("/activity", headers=auth_headers, json={
            "name": "Hiking",
            "difficulty": 3,
            "duration": 4,
            "season": ["summer", "spring"],
            "risk_level": 2,
            "about": "A nice hike",
            "country_ids": ["USA", "ARG"],
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] is not None
        assert data["difficulty"] == 3
        assert data["duration"] == 4
        assert data["risk_level"] == 2
        assert "id" in data
        assert data["created_by"] is not None
        assert len(data["country_ids"]) == 2
        assert "USA" in data["country_ids"]
        assert "ARG" in data["country_ids"]

    async def test_with_single_country(self, client, auth_headers, seed_countries):
        resp = await client.post("/activity", headers=auth_headers, json={
            "name": "Solo tour",
            "difficulty": 1,
            "duration": 1,
            "season": ["winter"],
            "risk_level": 1,
            "country_ids": ["JPN"],
        })
        assert resp.status_code == 201
        assert resp.json()["country_ids"] == ["JPN"]

    @pytest.mark.parametrize("override", [
        {"difficulty": 6},
        {"difficulty": 0},
        {"duration": 13},
        {"duration": 0},
        {"risk_level": 6},
        {"risk_level": 0},
        {"season": []},
        {"season": ["invalid"]},
        {"name": ""},
        {"country_ids": []},
    ])
    async def test_invalid_fields(self, client, auth_headers, seed_countries, override):
        payload = {
            "name": "Valid",
            "difficulty": 3,
            "duration": 2,
            "season": ["summer"],
            "risk_level": 2,
            "country_ids": ["USA"],
        }
        payload.update(override)
        resp = await client.post("/activity", headers=auth_headers, json=payload)
        assert resp.status_code == 422

    async def test_nonexistent_country(self, client, auth_headers):
        resp = await client.post("/activity", headers=auth_headers, json={
            "name": "Bad activity",
            "difficulty": 2,
            "duration": 3,
            "season": ["summer"],
            "risk_level": 2,
            "country_ids": ["XYZ"],
        })
        assert resp.status_code == 404


class TestListActivities:
    async def test_list_all(self, client, seed_activity):
        resp = await client.get("/activity")
        assert resp.status_code == 200
        data = resp.json()
        assert "items" in data
        assert len(data["items"]) >= 1

    async def test_filter_by_country(self, client, seed_activity):
        resp = await client.get("/activity?country_id=USA")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) >= 1

    async def test_filter_by_country_no_results(self, client, seed_activity):
        resp = await client.get("/activity?country_id=JPN")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) == 0

    async def test_pagination(self, client, seed_activity):
        resp = await client.get("/activity?page=1&limit=5")
        assert resp.status_code == 200
        data = resp.json()
        assert data["page"] == 1
        assert data["limit"] == 5
        assert data["total"] >= 1

    async def test_empty_list(self, client):
        resp = await client.get("/activity")
        assert resp.status_code == 200
        assert resp.json()["total"] == 0


class TestGetActivity:
    async def test_existing(self, client, seed_activity):
        resp = await client.get(f"/activity/{seed_activity.id}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == seed_activity.id
        assert data["name"] is not None

    async def test_not_found(self, client):
        resp = await client.get("/activity/99999")
        assert resp.status_code == 404


class TestUpdateActivity:
    async def test_own(self, client, seed_activity, auth_headers):
        resp = await client.put(
            f"/activity/{seed_activity.id}",
            headers=auth_headers,
            json={"name": "Updated", "difficulty": 5},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["difficulty"] == 5

    async def test_others(self, client, seed_activity, other_auth_headers):
        resp = await client.put(
            f"/activity/{seed_activity.id}",
            headers=other_auth_headers,
            json={"name": "Hacked"},
        )
        assert resp.status_code == 403

    async def test_no_auth(self, client, seed_activity):
        resp = await client.put(
            f"/activity/{seed_activity.id}",
            json={"name": "No auth"},
        )
        assert resp.status_code == 401

    async def test_not_found(self, client, auth_headers):
        resp = await client.put(
            "/activity/99999",
            headers=auth_headers,
            json={"name": "Ghost"},
        )
        assert resp.status_code == 404


class TestDeleteActivity:
    async def test_own(self, client, seed_activity, auth_headers):
        resp = await client.delete(f"/activity/{seed_activity.id}", headers=auth_headers)
        assert resp.status_code == 204

    async def test_others(self, client, seed_activity, other_auth_headers):
        resp = await client.delete(f"/activity/{seed_activity.id}", headers=other_auth_headers)
        assert resp.status_code == 403

    async def test_no_auth(self, client, seed_activity):
        resp = await client.delete(f"/activity/{seed_activity.id}")
        assert resp.status_code == 401

    async def test_not_found(self, client, auth_headers):
        resp = await client.delete("/activity/99999", headers=auth_headers)
        assert resp.status_code == 404
