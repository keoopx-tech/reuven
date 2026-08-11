import secrets

# Charset idéntico al de assets/js/auth.js — sin I, O, 0, 1
CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def gen_code() -> str:
    """Genera un código XXXX-XXXX con el mismo charset que el JS."""
    chars = [secrets.choice(CODE_CHARS) for _ in range(8)]
    return f"{''.join(chars[:4])}-{''.join(chars[4:])}"


def normalize_code(raw: str) -> str:
    """Limpia y formatea la entrada del usuario al formato XXXX-XXXX.

    Lanza ValueError si el código no tiene 8 caracteres válidos.
    """
    clean = "".join(c for c in raw.upper() if c in CODE_CHARS)
    if len(clean) != 8:
        raise ValueError(f"Código inválido: se esperan 8 caracteres del charset permitido, recibido '{raw}'")
    return f"{clean[:4]}-{clean[4:]}"


def strip_dash(code: str) -> str:
    """Elimina el guión para guardar en DB como clave primaria de 8 chars."""
    return code.replace("-", "")
