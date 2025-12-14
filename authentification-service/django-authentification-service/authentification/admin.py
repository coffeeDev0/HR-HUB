from django.contrib import admin

from authentification.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = (
        "userId",
        "userMail",
        "userName",
        "userForName",
        "phoneNumber",
        "role",
        "is_active",
    )
    search_fields = ("userMail", "userName", "userForName", "phoneNumber")
    list_filter = ("role",)
    ordering = ("userId",)


admin.site.register(User, UserAdmin)
