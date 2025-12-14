from django.apps import AppConfig


class AuthentificationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "authentification"

    def ready(self):
        # NE PAS démarrer le listener ici — il sera démarré via management command
        # après les migrations, dans entrypoint.sh
        pass
