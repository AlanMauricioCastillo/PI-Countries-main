from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.security import get_current_user, oauth2_scheme

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
