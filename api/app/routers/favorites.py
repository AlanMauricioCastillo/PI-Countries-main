from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Country, User, user_favorites
from app.schemas import CountryOut
from app.security import get_current_user

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("")
def list_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    fav_countries = (
        db.query(Country)
        .join(user_favorites, Country.id == user_favorites.c.country_id)
        .filter(user_favorites.c.user_id == current_user.id)
        .all()
    )
    return [CountryOut.model_validate(c) for c in fav_countries]


@router.post("/{country_id}", status_code=status.HTTP_201_CREATED)
def add_favorite(
    country_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    country = db.query(Country).filter(Country.id == country_id.upper()).first()
    if not country:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Country not found")

    existing = db.execute(
        user_favorites.select().where(
            user_favorites.c.user_id == current_user.id,
            user_favorites.c.country_id == country_id.upper(),
        )
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Favorite already exists")

    db.execute(
        user_favorites.insert().values(
            user_id=current_user.id,
            country_id=country_id.upper(),
        )
    )
    db.commit()
    return {"country_id": country_id.upper()}


@router.delete("/{country_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    country_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.execute(
        user_favorites.select().where(
            user_favorites.c.user_id == current_user.id,
            user_favorites.c.country_id == country_id.upper(),
        )
    ).first()
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")

    db.execute(
        user_favorites.delete().where(
            user_favorites.c.user_id == current_user.id,
            user_favorites.c.country_id == country_id.upper(),
        )
    )
    db.commit()
