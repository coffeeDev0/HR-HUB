from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.backends import TokenBackend

from django.conf import settings


class JwtProvider:

    @staticmethod
    def create_token(user):
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return {
            "access": str(access),
            "refresh": str(refresh),
            "access_expires": access.get("exp"),
            "role": str(user.role),
        }

    @staticmethod
    def refresh_token(token):
        try:
            refresh = RefreshToken(token)
            new_access = refresh.access_token

            # Optionnel : rotation automatique (désactivée ici)
            # new_refresh = RefreshToken.for_user(refresh.user)

            return {"access": str(new_access), "refresh": str(refresh)}

        except TokenError:
            raise Exception("Refresh token invalide ou expiré")

    @staticmethod
    def verify_token(token):
        try:
            backend = TokenBackend(
                algorithm=settings.SIMPLE_JWT["ALGORITHM"],
                signing_key=settings.SIMPLE_JWT["SIGNING_KEY"],
            )
            return backend.decode(token, verify=True)

        except Exception:
            raise Exception("Token invalide")
