from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.viewsets import (
    ModelViewSet,
    ReadOnlyModelViewSet,
    GenericViewSet,
)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.mixins import CreateModelMixin

from django.http import JsonResponse

from authentification.serializers import RegisterSerializer, UserSerializer
from authentification.models import User
from authentification.permissions import IsRh
from authentification.services.authentification_services import AuthenticationService
from authentification.services.jwt_provider import JwtProvider


from authentification.serializers import (
    AuthenticationSerializer,
    RefreshTokenSerializer,
    VerifyTokenSerializer,
)


class LoginViewSet(GenericViewSet):
    serializer_class = AuthenticationSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = AuthenticationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        userMail = serializer.validated_data["userMail"]
        password = serializer.validated_data["password"]

        user = AuthenticationService.authenticate_user(
            userMail=userMail, password=password
        )
        if not user:
            return Response(
                {"detail": "Identifiants invalides."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        tokens = JwtProvider.create_token(user)
        return Response(tokens, status=status.HTTP_200_OK)


class RefreshTokenViewSet(GenericViewSet):
    serializer_class = RefreshTokenSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        refresh_token = serializer.validated_data["refresh"]

        try:
            tokens = JwtProvider.refresh_token(refresh_token)
            return Response(tokens, status=status.HTTP_200_OK)

        except Exception:
            return Response(
                {"detail": "Refresh token invalide ou expiré."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class VerifyTokenViewSet(GenericViewSet):
    serializer_class = VerifyTokenSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["token"]

        try:
            payload = JwtProvider.verify_token(token)
            return Response(
                {"valid": True, "payload": payload}, status=status.HTTP_200_OK
            )

        except Exception:
            return Response({"valid": False}, status=status.HTTP_401_UNAUTHORIZED)


class UserViewSet(ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsRh]


class UserRegisterViewSet(CreateModelMixin, GenericViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class AdminUserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    """
    Health endpoint pour Docker + Eureka.
    Retourne 200 { "status": "UP" }.
    """
    return JsonResponse({"status": "UP"}, status=200)
