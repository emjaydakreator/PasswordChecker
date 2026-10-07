import math
import re


def load_common_passwords():
    """Load common passwords from common_passwords.txt."""
    try:
        with open("common_passwords.txt", "r", encoding="utf-8") as file:
            return {
                line.strip().lower()
                for line in file
                if line.strip()
            }
    except FileNotFoundError:
        return set()


COMMON_PASSWORDS = load_common_passwords()


def calculate_entropy(password):
    """Estimate password entropy in bits."""

    if not password:
        return 0

    character_pool = 0

    if re.search(r"[a-z]", password):
        character_pool += 26

    if re.search(r"[A-Z]", password):
        character_pool += 26

    if re.search(r"[0-9]", password):
        character_pool += 10

    if re.search(r"[^A-Za-z0-9]", password):
        character_pool += 32

    if character_pool == 0:
        return 0

    entropy = len(password) * math.log2(character_pool)

    return round(entropy, 2)


def check_password(password):
    """Check password against the required security rules."""

    checks = {
        "length": len(password) >= 12,
        "uppercase": bool(re.search(r"[A-Z]", password)),
        "lowercase": bool(re.search(r"[a-z]", password)),
        "number": bool(re.search(r"[0-9]", password)),
        "special": bool(re.search(r"[^A-Za-z0-9]", password)),
        "not_common": password.lower() not in COMMON_PASSWORDS
    }

    tips = []

    if not checks["length"]:
        tips.append("Use at least 12 characters.")

    if not checks["uppercase"]:
        tips.append("Add at least one uppercase letter.")

    if not checks["lowercase"]:
        tips.append("Add at least one lowercase letter.")

    if not checks["number"]:
        tips.append("Add at least one number.")

    if not checks["special"]:
        tips.append("Add at least one special character.")

    if not checks["not_common"]:
        tips.append("Avoid commonly used passwords.")

    score = sum(checks.values())

    if score <= 2:
        strength = "Weak"
    elif score <= 4:
        strength = "Fair"
    elif score == 5:
        strength = "Strong"
    else:
        strength = "Very Strong"

    return {
        "score": score,
        "max_score": 6,
        "strength": strength,
        "entropy": calculate_entropy(password),
        "checks": checks,
        "tips": tips
    }