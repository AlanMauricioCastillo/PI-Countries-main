import math

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import limiter
from app.models import Country
from app.schemas import CountryDetail, CountryOut, PaginatedCountries

router = APIRouter(prefix="/countries", tags=["countries"])


@router.get("", response_model=PaginatedCountries)
@limiter.limit("30/minute")
def list_countries(
    request: Request,
    name: str | None = Query(None),
    continent: str | None = Query(None),
    sort: str = Query("name", pattern="^(name|population|area)$"),
    order: str = Query("asc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    query = db.query(Country)

    if name:
        query = query.filter(Country.name_search.ilike(f"%{name.lower()}%"))
    if continent:
        query = query.filter(Country.continent == continent.lower())

    sort_col = getattr(Country, sort, Country.name)
    order_func = sort_col.asc if order == "asc" else sort_col.desc
    query = query.order_by(order_func())

    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()

    country_outs = []
    for c in items:
        co = CountryOut.model_validate(c)
        co.activities_count = len(c.activities)
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

    from app.schemas import ActivityOut

    detail = CountryDetail.model_validate(country)
    detail.activities_count = len(country.activities)
    detail.activities = [
        ActivityOut(
            id=a.id,
            name=a.name,
            difficulty=a.difficulty,
            duration=a.duration,
            season=a.season,
            risk_level=a.risk_level,
            created_by=a.created_by,
            created_at=a.created_at,
            country_names=[c.name for c in a.countries],
        )
        for a in country.activities
    ]
    return detail
