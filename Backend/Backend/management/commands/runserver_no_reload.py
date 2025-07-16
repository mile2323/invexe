from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Run Django server without auto-reload'

    def handle(self, *args, **options):
        call_command('runserver', '127.0.0.1:8000', '--noreload')