from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./dev.db"
    JWT_SECRET: str = "change-me-32-chars-minimum-secret-value"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    APP_ENV: str = "development"
    CORS_ORIGINS: str = "http://localhost:3000"
    BCRYPT_COST: int = 12

    def model_post_init(self, __context):
        if self.APP_ENV == "production" and (
            not self.JWT_SECRET
            or self.JWT_SECRET == "change-me-32-chars-minimum-secret-value"
            or len(self.JWT_SECRET) < 32
        ):
            raise RuntimeError(
                "JWT_SECRET must be set to a secure value (min 32 chars) in production"
            )


settings = Settings()
