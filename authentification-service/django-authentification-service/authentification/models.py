from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


class UserManager(BaseUserManager):

    class TypeRole(models.TextChoices):
        ADMIN = "Admin"
        RH = "Rh"
        EMPLOYEE = "Employee"

    def create_user(self, userMail, password=None, **extra_fields):
        if not userMail:
            raise ValueError("L'adresse Mail est obligatoire")

        extra_fields.setdefault("role", self.TypeRole.EMPLOYEE)

        user = self.model(userMail=self.normalize_email(userMail), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, userMail, password=None, **extra_fields):

        extra_fields.setdefault("role", self.TypeRole.ADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(userMail, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    class TypeRole(models.TextChoices):
        ADMIN = "Admin"
        RH = "Rh"
        EMPLOYEE = "Employee"

    userId = models.AutoField(primary_key=True)
    userMail = models.EmailField(max_length=100, unique=True)
    userName = models.CharField(max_length=100)
    userForName = models.CharField(max_length=100)
    phoneNumber = models.IntegerField(null=True)
    role = models.CharField(
        max_length=50, choices=TypeRole.choices, default=TypeRole.EMPLOYEE
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "userMail"
    REQUIRED_FIELDS = ["userName", "userForName", "phoneNumber"]

    def __str__(self):
        return self.userName
