import pytest

pytestmark = pytest.mark.asyncio


class TestListCountries:
    async def test_default_pagination(self, client, seed_countries):
        resp = await client.get("/countries")
        assert resp.status_code == 200
        data = resp.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "limit" in data
        assert "pages" in data
        assert data["page"] == 1
        assert data["limit"] == 10
        assert data["total"] == 5

    async def test_custom_page_limit(self, client, seed_countries):
        resp = await client.get("/countries?page=2&limit=2")
        assert resp.status_code == 200
        data = resp.json()
        assert data["page"] == 2
        assert data["limit"] == 2
        assert len(data["items"]) == 2

    async def test_filter_by_name(self, client, seed_countries):
        resp = await client.get("/countries?name=arg")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) == 1
        assert data["items"][0]["id"] == "ARG"

    async def test_filter_by_name_case_insensitive(self, client, seed_countries):
        resp = await client.get("/countries?name=ARGENTINA")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) >= 1

    async def test_filter_by_continent(self, client, seed_countries):
        resp = await client.get("/countries?continent=europe")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) == 2
        ids = {c["id"] for c in data["items"]}
        assert ids == {"GBR", "FRA"}

    async def test_filter_by_continent_case_insensitive(self, client, seed_countries):
        resp = await client.get("/countries?continent=Europe")
        assert resp.status_code == 200
        assert resp.json()["total"] >= 2

    async def test_sort_by_name_asc(self, client, seed_countries):
        resp = await client.get("/countries?sort=name&order=asc")
        assert resp.status_code == 200
        data = resp.json()
        names = [c["name"] for c in data["items"]]
        assert names == sorted(names)

    async def test_sort_by_name_desc(self, client, seed_countries):
        resp = await client.get("/countries?sort=name&order=desc")
        assert resp.status_code == 200
        data = resp.json()
        names = [c["name"] for c in data["items"]]
        assert names == sorted(names, reverse=True)

    async def test_sort_by_population_desc(self, client, seed_countries):
        resp = await client.get("/countries?sort=population&order=desc")
        assert resp.status_code == 200
        data = resp.json()
        populations = [c["population"] for c in data["items"]]
        assert populations == sorted(populations, reverse=True)

    async def test_sort_by_area_asc(self, client, seed_countries):
        resp = await client.get("/countries?sort=area&order=asc")
        assert resp.status_code == 200
        data = resp.json()
        areas = [c["area"] for c in data["items"]]
        assert areas == sorted(areas)

    async def test_invalid_sort_field(self, client, seed_countries):
        resp = await client.get("/countries?sort=invalid")
        assert resp.status_code == 422

    async def test_invalid_order_value(self, client, seed_countries):
        resp = await client.get("/countries?order=invalid")
        assert resp.status_code == 422


class TestGetCountry:
    async def test_existing(self, client, seed_countries):
        resp = await client.get("/countries/ARG")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == "ARG"
        assert data["name"] == "Argentina"
        assert data["continent"] == "americas"
        assert data["capital"] == "Buenos Aires"
        assert "activities" in data

    async def test_not_found(self, client):
        resp = await client.get("/countries/XYZ")
        assert resp.status_code == 404

    async def test_case_insensitive(self, client, seed_countries):
        resp = await client.get("/countries/arg")
        assert resp.status_code == 200
        assert resp.json()["id"] == "ARG"

    async def test_invalid_id_length(self, client):
        resp = await client.get("/countries/ABCD")
        assert resp.status_code == 422
