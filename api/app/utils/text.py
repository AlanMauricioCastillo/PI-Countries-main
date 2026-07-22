import unicodedata


def normalize_country_name(name: str) -> str:
    nfkd = unicodedata.normalize("NFKD", name)
    return nfkd.encode("ascii", "ignore").decode("ascii").lower()
