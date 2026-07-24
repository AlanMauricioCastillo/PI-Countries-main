from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session

from app.config import settings
from app.database import Base, engine
from app.deps import limiter
from app.models import Country
from app.routers import activity, auth, countries, favorites


def _auto_seed_if_empty():
    with Session(engine) as db:
        count = db.query(Country).count()
        if count > 0:
            return
    from scripts.seed import clean_data, fetch_countries
    raw = fetch_countries()
    data = clean_data(raw)
    with Session(engine) as db:
        for row in data:
            db.add(Country(**row))
        db.commit()
    print(f"[auto-seed] Inserted {len(data)} countries on startup")


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    _auto_seed_if_empty()
    yield


app = FastAPI(title="Country-PI API", version="1.0.0", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    if settings.APP_ENV == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response


app.include_router(auth.router)
app.include_router(countries.router)
app.include_router(activity.router)
app.include_router(favorites.router)


@app.get("/seed")
def seed_database():
    from scripts.seed import main as run_seed
    try:
        run_seed()
        return {"status": "ok", "message": "Database seeded"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
