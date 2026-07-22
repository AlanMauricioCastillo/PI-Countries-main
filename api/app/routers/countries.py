import json
import math

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import limiter
from app.models import Country, Activity
from app.schemas import ActivityOut, CountryDetail, CountryOut, PaginatedCountries

router = APIRouter(prefix="/countries", tags=["countries"])


@router.get("", response_model=PaginatedCountries)
@limiter.limit("30/minute")
def list_countries(
    request: Request,
    name: str | None = Query(None),
    continent: str | None = Query(None),
    sort: str = Query("name", pattern="^(name|population|area)$"),
    order: str = Query("asc"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=250),
    db: Session = Depends(get_db),
):
    query = db.query(Country)

    if name:
        query = query.filter(Country.name_search.ilike(f"%{name.lower()}%"))
    if continent:
        query = query.filter(Country.continent == continent.lower())

    sort_col = getattr(Country, sort, Country.name)
    order_func = sort_col.asc if order.lower() == "asc" else sort_col.desc
    query = query.order_by(order_func())

    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()

    country_outs = []
    for c in items:
        co = CountryOut.model_validate(c)
        co.activities_count = len(c.activities)
        co.Activities = [
            {"name": a.name, "difficulty": a.difficulty, "duration": a.duration, "season": [s.lower() for s in (json.loads(a.season) if isinstance(a.season, str) and a.season.startswith("[") else [a.season])]}
            for a in (c.activities or [])
        ]
        country_outs.append(co)

    return PaginatedCountries(
        items=country_outs,
        total=total,
        page=page,
        limit=limit,
        pages=math.ceil(total / limit) if total > 0 else 1,
    )


@router.get("/{id}", response_model=CountryDetail)
def get_country(id: str, db: Session = Depends(get_db)):
    country = db.query(Country).filter(Country.id == id.upper()).first()
    if not country:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Country not found")

    def _parse_season(s):
        if isinstance(s, str):
            try:
                parsed = json.loads(s)
                if isinstance(parsed, list):
                    return [p.lower() for p in parsed]
            except (json.JSONDecodeError, TypeError):
                return [s.lower()]
        elif isinstance(s, list):
            return [x.lower() for x in s]
        return [str(s).lower()]

    activities = []
    for a in country.activities or []:
        activities.append(ActivityOut(
            id=a.id,
            name=a.name,
            difficulty=a.difficulty,
            duration=a.duration,
            season=_parse_season(a.season),
            risk_level=a.risk_level,
            created_by=a.created_by,
            created_at=a.created_at,
            country_ids=[c.id for c in a.countries or []],
            country_names=[c.name for c in a.countries or []],
        ))

    return CountryDetail(
        id=country.id,
        name=country.name,
        continent=country.continent,
        capital=country.capital,
        subregion=country.subregion,
        area=country.area,
        population=country.population,
        flag_url=country.flag_url,
        activities_count=len(country.activities or []),
        activities=activities,
    )
