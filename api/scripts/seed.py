import json
import os
import time
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

import requests
from dotenv import load_dotenv
from sqlalchemy import Column, DateTime, Float, Integer, String, create_engine, Index
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
RESTCOUNTRIES_API_KEY = os.getenv("RESTCOUNTRIES_API_KEY", "")
CACHE_DIR = Path(__file__).parent / "data"
CACHE_FILE = CACHE_DIR / "countries.json"
V3_API = "https://restcountries.com/v3.1/all"
V5_API = "https://api.restcountries.com/countries/v5"
FALLBACK_API = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
MAX_RETRIES = 3

Base = declarative_base()


class Country(Base):
    __tablename__ = "countries"

    id = Column(String(3), primary_key=True)
    name = Column(String(100), nullable=False)
    name_search = Column(String(100), nullable=False, index=True)
    continent = Column(String(30), nullable=False, index=True)
    capital = Column(String(100), nullable=True)
    subregion = Column(String(60), nullable=True)
    area = Column(Float, nullable=True)
    population = Column(Integer, nullable=True)
    flag_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


def normalize_search(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    return text.lower()


def is_deprecation_error(data) -> bool:
    if isinstance(data, dict) and data.get("success") is False:
        for err in data.get("errors") or []:
            if "deprecated" in (err.get("message") or "").lower():
                return True
    return False


def try_v3_api() -> list[dict] | None:
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(f"[seed] Fetching v3 API (attempt {attempt}/{MAX_RETRIES})...")
            resp = requests.get(V3_API, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            if isinstance(data, list):
                return data
            if is_deprecation_error(data):
                print(f"[seed] v3 API deprecated, trying v5...")
                return None
        except requests.RequestException as e:
            print(f"[seed] v3 attempt {attempt} failed: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(2 ** attempt)
    return None


def try_v5_api() -> list[dict] | None:
    if not RESTCOUNTRIES_API_KEY:
        print("[seed] No RESTCOUNTRIES_API_KEY set, skipping v5.")
        return None

    headers = {"Authorization": f"Bearer {RESTCOUNTRIES_API_KEY}"}
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(f"[seed] Fetching v5 API (attempt {attempt}/{MAX_RETRIES})...")
            resp = requests.get(f"{V5_API}?limit=250", headers=headers, timeout=30)
            resp.raise_for_status()
            body = resp.json()
            objects = (body.get("data") or {}).get("objects")
            if objects is not None:
                return objects
        except requests.RequestException as e:
            print(f"[seed] v5 attempt {attempt} failed: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(2 ** attempt)
    return None


def try_fallback_api() -> list[dict] | None:
    try:
        print(f"[seed] Fetching fallback dataset...")
        resp = requests.get(FALLBACK_API, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, list):
            print(f"[seed] Fallback returned {len(data)} countries.")
            return data
    except requests.RequestException as e:
        print(f"[seed] Fallback failed: {e}")
    return None


def clean_v3_data(raw: list[dict]) -> list[dict]:
    cleaned = []
    skipped = 0
    for entry in raw:
        cca3 = entry.get("cca3")
        if not cca3 or not cca3.strip():
            skipped += 1
            continue
        name_common = (entry.get("name") or {}).get("common", "")
        if not name_common:
            skipped += 1
            continue
        capital_list = entry.get("capital") or []
        capital = capital_list[0] if capital_list else None
        cleaned.append({
            "id": cca3.upper()[:3],
            "name": name_common,
            "name_search": normalize_search(name_common),
            "continent": (entry.get("region") or "").lower(),
            "capital": capital,
            "subregion": entry.get("subregion"),
            "flag_url": (entry.get("flags") or {}).get("svg", ""),
            "area": entry.get("area"),
            "population": entry.get("population"),
        })
    print(f"[seed] Cleaned {len(cleaned)} countries, skipped {skipped}.")
    return cleaned


def clean_mledoze_data(raw: list[dict]) -> list[dict]:
    cleaned = []
    skipped = 0
    for entry in raw:
        cca3 = entry.get("cca3")
        if not cca3 or not cca3.strip():
            skipped += 1
            continue
        name_common = (entry.get("name") or {}).get("common", "")
        if not name_common:
            skipped += 1
            continue
        capital_list = entry.get("capital") or []
        capital = capital_list[0] if capital_list else None
        cca2 = (entry.get("cca2") or "").lower()
        flag_url = f"https://flagcdn.com/{cca2}.svg" if cca2 else ""
        cleaned.append({
            "id": cca3.upper()[:3],
            "name": name_common,
            "name_search": normalize_search(name_common),
            "continent": (entry.get("region") or "").lower(),
            "capital": capital,
            "subregion": entry.get("subregion"),
            "flag_url": flag_url,
            "area": entry.get("area"),
            "population": entry.get("population"),
        })
    print(f"[seed] Cleaned {len(cleaned)} countries (fallback), skipped {skipped}.")
    return cleaned


def fetch_countries() -> list[dict]:
    if CACHE_FILE.exists():
        print(f"[seed] Loading from cache: {CACHE_FILE}")
        with open(CACHE_FILE, encoding="utf-8") as f:
            return json.load(f)

    CACHE_DIR.mkdir(parents=True, exist_ok=True)

    data = try_v3_api()
    if data is None:
        data = try_v5_api()
    if data is None:
        data = try_fallback_api()

    if data is None:
        raise SystemExit(
            "[seed] Could not fetch countries from any source.\n"
            "  Set RESTCOUNTRIES_API_KEY in .env (get one at https://restcountries.com/sign-up)\n"
            "  Or place a countries.json cache at api/scripts/data/countries.json"
        )

    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[seed] Saved {len(data)} entries to cache.")

    return data


def clean_data(raw: list[dict]) -> list[dict]:
    if raw and isinstance(raw[0], dict):
        if "cca3" in raw[0]:
            return clean_v3_data(raw)
        if "codes" in raw[0]:
            return clean_v5_data(raw)
    return clean_mledoze_data(raw)


def clean_v5_data(raw: list[dict]) -> list[dict]:
    cleaned = []
    skipped = 0
    for entry in raw:
        codes = entry.get("codes") or {}
        cca3 = codes.get("alpha_3")
        if not cca3:
            skipped += 1
            continue
        names = entry.get("names") or {}
        name_common = names.get("common", "")
        if not name_common:
            skipped += 1
            continue
        capitals = entry.get("capitals") or []
        capital = capitals[0].get("name") if capitals else None
        flag_url = (entry.get("flag") or {}).get("url_svg", "") or ""
        cleaned.append({
            "id": cca3.upper()[:3],
            "name": name_common,
            "name_search": normalize_search(name_common),
            "continent": (entry.get("region") or "").lower(),
            "capital": capital,
            "subregion": entry.get("subregion"),
            "flag_url": flag_url,
            "area": (entry.get("area") or {}).get("kilometers") if isinstance(entry.get("area"), dict) else entry.get("area"),
            "population": entry.get("population"),
        })
    print(f"[seed] Cleaned {len(cleaned)} countries (v5), skipped {skipped}.")
    return cleaned


def seed_database(countries: list[dict]) -> None:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    )
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        Country.__table__.drop(engine, checkfirst=True)
    except Exception:
        pass

    Base.metadata.create_all(engine)

    try:
        for row in countries:
            session.add(Country(**row))

        session.commit()
        print(f"[seed] Inserted {len(countries)} countries into {DATABASE_URL}")
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
        engine.dispose()


def main():
    print("=== Countries Seed Script ===")
    print(f"DB: {DATABASE_URL}")
    raw = fetch_countries()
    countries = clean_data(raw)
    seed_database(countries)
    print("=== Done ===")


if __name__ == "__main__":
    main()
