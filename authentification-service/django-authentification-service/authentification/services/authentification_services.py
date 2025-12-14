from authentification.models import User

from authentification.services.jwt_provider import JwtProvider
from authentification.services.password_hasher import PasswordHasher


class AuthenticationService:

    @staticmethod
    def authenticate_user(userMail, password):
        try:
            user = User.objects.get(userMail__iexact=userMail)
        except User.DoesNotExist:
            return None

        if PasswordHasher.verify(password, user.password):
            return user

        return None

    @staticmethod
    def generate_token(user):
        return JwtProvider.create_token(user)
