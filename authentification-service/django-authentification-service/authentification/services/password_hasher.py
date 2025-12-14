from django.contrib.auth.hashers import make_password, check_password


class PasswordHasher:

    @staticmethod
    def hash(password):
        return make_password(password)

    @staticmethod
    def verify(password, hashed_password):
        return check_password(password, hashed_password)
