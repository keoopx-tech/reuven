from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/reuven"
    jwt_secret: str = "changeme-en-produccion-usar-key-vault"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 30
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    environment: str = "development"
    bcrypt_rounds: int = 12

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


settings = Settings()
