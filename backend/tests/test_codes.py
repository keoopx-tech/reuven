"""Test crítico: el charset de gen_code() debe ser byte-a-byte idéntico al de auth.js."""

import pytest
from app.core.codes import CODE_CHARS, gen_code, normalize_code, strip_dash

# El charset exacto del JS (assets/js/auth.js línea: CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789")
JS_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def test_charset_identico_al_js():
    """CRÍTICO: si esto falla, los códigos generados en Python no coinciden con los del JS."""
    assert CODE_CHARS == JS_CHARSET, (
        f"Charset diferente al JS!\nPython: {CODE_CHARS}\n    JS: {JS_CHARSET}"
    )


def test_charset_excluye_caracteres_confusos():
    """Verifica que no incluye I, O, 0, 1 (confundibles)."""
    for char in "IO01":
        assert char not in CODE_CHARS, f"'{char}' no debe estar en el charset"


def test_gen_code_formato():
    for _ in range(100):
        code = gen_code()
        assert len(code) == 9, f"Longitud incorrecta: {code}"
        assert code[4] == "-", f"Falta el guión en posición 4: {code}"
        for c in code.replace("-", ""):
            assert c in CODE_CHARS, f"Carácter '{c}' no está en el charset: {code}"


def test_normalize_code_valido():
    assert normalize_code("ABCD1234") == "ABCD-1234"
    assert normalize_code("abcd1234") == "ABCD-1234"
    assert normalize_code("ABCD-1234") == "ABCD-1234"


def test_normalize_code_invalido():
    with pytest.raises(ValueError):
        normalize_code("ABC")  # muy corto

    with pytest.raises(ValueError):
        normalize_code("ABCD123I")  # I no está en charset


def test_strip_dash():
    assert strip_dash("ABCD-1234") == "ABCD1234"
    assert strip_dash("ABCD1234") == "ABCD1234"
