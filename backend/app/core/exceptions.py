from fastapi import HTTPException, status


class NotFound(HTTPException):
    def __init__(self, detail: str = "No encontrado"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class Forbidden(HTTPException):
    def __init__(self, detail: str = "Sin permiso"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class Conflict(HTTPException):
    def __init__(self, detail: str = "Conflicto"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class BadRequest(HTTPException):
    def __init__(self, detail: str = "Solicitud inválida"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class Unauthorized(HTTPException):
    def __init__(self, detail: str = "No autenticado"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )
