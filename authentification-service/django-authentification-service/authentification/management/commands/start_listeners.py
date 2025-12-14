from django.core.management.base import BaseCommand
from authentification.rabbit_listener import start_rabbit_listener
from authentification.eureka_client import start_eureka_client


class Command(BaseCommand):
    help = "Démarre les listeners RabbitMQ et le client Eureka (après les migrations)"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Démarrage des listeners...'))
        start_rabbit_listener()
        start_eureka_client()
        self.stdout.write(self.style.SUCCESS('✅ Listeners démarrés avec succès'))
        # Bloquer pour que le processus ne se termine pas
        try:
            import time
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING('⛔ Listeners arrêtés'))
