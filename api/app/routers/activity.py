from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import limiter
from app.models import Activity, Country, User, activity_country
from app.schemas import ActivityCreate, ActivityOut, ActivityUpdate
from app.security import get_current_user

router = APIRouter(prefix="/activity", tags=["activity"])


import json


def _activity_to_out(a: Activity) -> ActivityOut:
    season_raw = a.season
    if isinstance(season_raw, str):
        try:
            parsed = json.loads(season_raw)
            if isinstance(parsed, list):
                season_val = [s.lower() for s in parsed]
            else:
                season_val = [season_raw.lower()]
        except (json.JSONDecodeError, TypeError):
            season_val = [season_raw.lower()]
    else:
        season_val = season_raw

    return ActivityOut(
        id=a.id,
        name=a.name,
        difficulty=a.difficulty,
        duration=a.duration,
        season=season_val,
        risk_level=a.risk_level,
        created_by=a.created_by,
        created_at=a.created_at,
        country_ids=[c.id for c in a.countries],
        country_names=[c.name for c in a.countries],
    )


@router.post("", status_code=status.HTTP_201_CREATED, response_model=ActivityOut)
@limiter.limit("10/minute")
def create_activity(
    request: Request,
    body: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    countries = db.query(Country).filter(Country.id.in_(body.country_ids)).all()
    if len(countries) != len(body.country_ids):
        existing = {c.id for c in countries}
        missing = [cid for cid in body.country_ids if cid not in existing]
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Countries not found: {', '.join(missing)}",
        )

    activity = Activity(
        name=body.name,
        difficulty=body.difficulty,
        duration=body.duration,
        season=body.season,
        risk_level=body.risk_level,
        created_by=current_user.id,
        countries=countries,
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return _activity_to_out(activity)


@router.get("", response_model=list[ActivityOut])
def list_activities(db: Session = Depends(get_db)):
    activities = db.query(Activity).all()
    return [_activity_to_out(a) for a in activities]


@router.get("/{id}", response_model=ActivityOut)
def get_activity(id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == id).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    return _activity_to_out(activity)


@router.put("/{id}", response_model=ActivityOut)
def update_activity(
    id: int,
    body: ActivityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activity = db.query(Activity).filter(Activity.id == id).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    if activity.created_by is None or activity.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this activity")

    update_data = body.model_dump(exclude_unset=True)
    country_ids = update_data.pop("country_ids", None)

    for field, value in update_data.items():
        setattr(activity, field, value)

    if country_ids is not None:
        countries = db.query(Country).filter(Country.id.in_(country_ids)).all()
        activity.countries = countries

    db.commit()
    db.refresh(activity)
    return _activity_to_out(activity)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    activity = db.query(Activity).filter(Activity.id == id).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    if activity.created_by is None or activity.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this activity")

    db.delete(activity)
    db.commit()
