from rest_framework.serializers import (
    Serializer,
    ModelSerializer,
    CharField,
    ValidationError,
    EmailField,
)

from django.contrib.auth.password_validation import validate_password

from authentification.models import User


class AuthenticationSerializer(Serializer):
    userMail = EmailField(required=True)
    password = CharField(write_only=True, required=True)

    def validate(self, attrs):
        userMail = attrs.get("userMail")
        password = attrs.get("password")

        if not userMail:
            raise ValidationError({"userMail": "L'email est requis."})

        if not password:
            raise ValidationError({"password": "Le mot de passe est requis."})

        return attrs


class RefreshTokenSerializer(Serializer):
    refresh = CharField(required=True)

    def validate(self, attrs):
        refresh = attrs.get("refresh")
        if not refresh:
            raise ValidationError({"refresh": "Le refresh token est requis."})
        return attrs


class VerifyTokenSerializer(Serializer):
    token = CharField(required=True)

    def validate(self, attrs):
        token = attrs.get("token")
        if not token:
            raise ValidationError({"token": "Le token est requis."})
        return attrs


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = (
            "userId",
            "userMail",
            "userName",
            "userForName",
            "phoneNumber",
            "role",
        )
        read_only_fields = ("userId", "role")


class RegisterSerializer(ModelSerializer):
    password = CharField(write_only=True, required=True)
    password2 = CharField(write_only=True, required=True, label="Confirm Password")
    role = CharField(required=True)

    class Meta:
        model = User
        fields = (
            "userId",
            "userMail",
            "userName",
            "userForName",
            "password",
            "password2",
            "phoneNumber",
            "role",
        )
        read_only_fields = ("userId",)

    def validate(self, attrs):
        if attrs.get("password") != attrs.get("password2"):
            raise ValidationError(
                {"password": "Les mots de passe ne correspondent pas."}
            )
        validate_password(attrs.get("password"))

        valid_roles = [choice[0] for choice in User.TypeRole.choices]
        if attrs.get("role") not in valid_roles:
            raise ValidationError({"role": "Rôle invalide"})
        if attrs.get("role") == User.TypeRole.ADMIN:
            raise ValidationError(
                {"role": "l'enregistrement en tant qu'admin n'est pas autorisée."}
            )

        email = attrs.get("userMail")
        if User.objects.filter(userMail__iexact=email).exists():
            raise ValidationError({"userMail": "Cet email est déjà utilisé."})

        return attrs

    def create(self, validated_data):
        validated_data["userMail"] = validated_data["userMail"].lower()
        validated_data.pop("password2")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user
