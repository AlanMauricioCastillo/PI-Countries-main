from datetime import datetime
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    StringConstraints,
    conint,
    field_validator,
)
from typing_extensions import Annotated


class UserCreate(BaseModel):
    username: Annotated[
        str,
        StringConstraints(
            strip_whitespace=True,
            pattern=r"^[a-zA-Z0-9_]+$",
            min_length=3,
            max_length=30,
        ),
    ]
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=8, max_length=128)]

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


class LoginIn(BaseModel):
    identifier: Annotated[str, StringConstraints(min_length=3, max_length=255)]
    password: Annotated[str, StringConstraints(min_length=1, max_length=128)]


class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"


class CountryOut(BaseModel):
    id: str
    name: str
    continent: str
    capital: str | None
    subregion: str | None
    area: float | None
    population: int | None
    flag_url: str | None
    activities_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class CountryDetail(CountryOut):
    activities: list["ActivityOut"] = []


class PaginatedCountries(BaseModel):
    items: list[CountryOut]
    total: int
    page: int
    limit: int
    pages: int


Season = Literal["Spring", "Summer", "Fall", "Winter"]


class ActivityCreate(BaseModel):
    name: Annotated[str, StringConstraints(strip_whitespace=True, max_length=200)]
    difficulty: conint(ge=1, le=5)
    duration: conint(ge=1, le=12)
    season: Season
    risk_level: conint(ge=1, le=5)
    countryIds: list[str] = Field(min_length=1)


class ActivityOut(BaseModel):
    id: int
    name: str
    difficulty: int
    duration: int
    season: str
    risk_level: int
    created_by: int | None
    created_at: datetime
    country_names: list[str] = []

    model_config = ConfigDict(from_attributes=True)


class ActivityUpdate(BaseModel):
    name: str | None = None
    difficulty: conint(ge=1, le=5) | None = None
    duration: conint(ge=1, le=12) | None = None
    season: Season | None = None
    risk_level: conint(ge=1, le=5) | None = None
    countryIds: list[str] | None = None


class FavoritesOut(BaseModel):
    countries: list[CountryOut]
