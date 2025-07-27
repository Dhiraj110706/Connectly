"""
ASGI config for socialapp project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from chat.consumers import ChatConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'socialapp.settings')

# Initialize Django ASGI application early
django_asgi_app = get_asgi_application()

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>[\w_]+)/$', ChatConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": URLRouter(websocket_urlpatterns),  # Removed AuthMiddlewareStack temporarily
})