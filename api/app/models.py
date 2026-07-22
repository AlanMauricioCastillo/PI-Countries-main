from datetime import datetime, timezone

from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


activity_country = Table(
    "activity_country",
    Base.metadata,
    Column("activity_id", Integer, ForeignKey("activities.id", ondelete="CASCADE"), primary_key=True),
    Column("country_id", String(3), ForeignKey("countries.id", ondelete="CASCADE"), primary_key=True),
)


user_favorites = Table(
    "user_favorites",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("country_id", String(3), ForeignKey("countries.id", ondelete="CASCADE"), primary_key=True),
    Column("created_at", DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)),
)


class Country(Base):
    __tablename__ = "countries"

    id: Mapped[str] = mapped_column(String(3), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    name_search: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    continent: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    capital: Mapped[str | None] = mapped_column(String(100), default=None)
    subregion: Mapped[str | None] = mapped_column(String(60), nullable=True)
    area: Mapped[float | None] = mapped_column(Float, nullable=True)
    population: Mapped[int | None] = mapped_column(Integer, nullable=True)
    flag_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    activities: Mapped[list["Activity"]] = relationship(secondary=activity_country, back_populates="countries")


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    difficulty: Mapped[int] = mapped_column(Integer, nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    season: Mapped[str] = mapped_column(Text, nullable=False)
    risk_level: Mapped[int] = mapped_column(Integer, nullable=False)
    created_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint("difficulty >= 1 AND difficulty <= 5", name="ck_activity_difficulty"),
        CheckConstraint("duration >= 1 AND duration <= 12", name="ck_activity_duration"),
        CheckConstraint("risk_level >= 1 AND risk_level <= 5", name="ck_activity_risk_level"),
    )

    countries: Mapped[list["Country"]] = relationship(secondary=activity_country, back_populates="activities")
    creator: Mapped["User | None"] = relationship(back_populates="activities")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(30), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    activities: Mapped[list["Activity"]] = relationship(back_populates="creator")
    favorite_countries: Mapped[list["Country"]] = relationship(secondary=user_favorites)
