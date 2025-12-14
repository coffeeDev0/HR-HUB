from rest_framework.permissions import BasePermission


class IsRh(BasePermission):
    """
    Allow access to users with Rh role.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role == "Rh"
        )
