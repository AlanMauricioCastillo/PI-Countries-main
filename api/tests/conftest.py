import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models import User
from app.security import hash_password, create_access_token


@pytest.fixture
def db_session():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    @event.listens_for(engine, "connect")
    def _fk_on(dbapi_conn, _):
        dbapi_conn.execute("PRAGMA foreign_keys=ON")

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = Session()

    app.dependency_overrides[get_db] = lambda: session

    yield session

    session.close()
    engine.dispose()
    app.dependency_overrides.clear()


@pytest.fixture
async def client(db_session):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def auth_headers(db_session):
    user = User(
        email="testuser@example.com",
        username="testuser",
        hashed_password=hash_password("TestPass1"),
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    token = create_access_token({"sub": str(user.id), "username": user.username})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def other_auth_headers(db_session):
    user = User(
        email="other@example.com",
        username="otheruser",
        hashed_password=hash_password("TestPass1"),
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    token = create_access_token({"sub": str(user.id), "username": user.username})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def inactive_auth_headers(db_session):
    user = User(
        email="inactive@example.com",
        username="inactiveuser",
        hashed_password=hash_password("TestPass1"),
        is_active=False,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    token = create_access_token({"sub": str(user.id), "username": user.username})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def seed_countries(db_session):
    from app.models import Country

    countries_data = [
        Country(id="USA", name="United States", name_search="united states",
                continent="americas", capital="Washington DC", subregion="north america",
                flag_url="https://flagcdn.com/us.svg", map_url="https://goo.gl/maps/USA",
                area=9833520, population=331900000),
        Country(id="GBR", name="United Kingdom", name_search="united kingdom",
                continent="europe", capital="London", subregion="northern europe",
                flag_url="https://flagcdn.com/gb.svg", map_url="https://goo.gl/maps/GBR",
                area=242495, population=67330000),
        Country(id="JPN", name="Japan", name_search="japan",
                continent="asia", capital="Tokyo", subregion="eastern asia",
                flag_url="https://flagcdn.com/jp.svg", map_url="https://goo.gl/maps/JPN",
                area=377975, population=125800000),
        Country(id="FRA", name="France", name_search="france",
                continent="europe", capital="Paris", subregion="western europe",
                flag_url="https://flagcdn.com/fr.svg", map_url="https://goo.gl/maps/FRA",
                area=640679, population=67390000),
        Country(id="ARG", name="Argentina", name_search="argentina",
                continent="americas", capital="Buenos Aires", subregion="south america",
                flag_url="https://flagcdn.com/ar.svg", map_url="https://goo.gl/maps/ARG",
                area=2780400, population=45810000),
    ]
    for c in countries_data:
        db_session.add(c)
    db_session.commit()
    return countries_data


@pytest.fixture
async def seed_activity(db_session, seed_countries, auth_headers):
    from app.models import Activity, activity_country

    import re
    match = re.search(r"Bearer\s+(\S+)", auth_headers["Authorization"])
    from app.security import decode_access_token
    payload = decode_access_token(match.group(1))
    user_id = int(payload["sub"])

    activity = Activity(
        name="Test Activity",
        difficulty=3,
        duration=4,
        season=["summer"],
        risk_level=2,
        about="A test activity",
        created_by=user_id,
    )
    db_session.add(activity)
    db_session.flush()

    for country in seed_countries[:2]:
        db_session.execute(
            activity_country.insert().values(
                activity_id=activity.id,
                country_id=country.id,
            )
        )

    db_session.commit()
    db_session.refresh(activity)
    return activity


@pytest.fixture
async def expired_token():
    from datetime import datetime, timedelta, timezone
    from app.security import create_access_token
    return {"Authorization": f"Bearer {create_access_token({'sub': '1', 'username': 'test'}, expires_delta=timedelta(hours=-1))}"}
