# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from channels.db import database_sync_to_async
# from django.contrib.auth import get_user_model
# from .models import ChatMessage

# User = get_user_model()

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = f'chat_{self.room_name}'

#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']
#         sender_id = text_data_json['sender_id']
#         receiver_id = text_data_json['receiver_id']

#         # Save message to database
#         await self.save_message(sender_id, receiver_id, message)

#         # Send message to room group
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message,
#                 'sender_id': sender_id,
#                 'receiver_id': receiver_id
#             }
#         )

#     async def chat_message(self, event):
#         message = event['message']
#         sender_id = event['sender_id']
#         receiver_id = event['receiver_id']

#         await self.send(text_data=json.dumps({
#             'message': message,
#             'sender_id': sender_id,
#             'receiver_id': receiver_id
#         }))

#     @database_sync_to_async
#     def save_message(self, sender_id, receiver_id, message):
#         sender = User.objects.get(id=sender_id)
#         receiver = User.objects.get(id=receiver_id)
#         ChatMessage.objects.create(
#             sender=sender,
#             receiver=receiver,
#             message=message
#         )

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import ChatMessage

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"✅ WebSocket connected to room: {self.room_name}")

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"❌ WebSocket disconnected from room: {self.room_name}, code: {close_code}")

    async def receive(self, text_data):
        try:
            print(f"📨 Received: {text_data}")
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            sender_id = text_data_json['sender_id']
            receiver_id = text_data_json['receiver_id']

            # Save message to database (optional, comment out if causing issues)
            # await self.save_message(sender_id, receiver_id, message)

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender_id': sender_id,
                    'receiver_id': receiver_id
                }
            )
            print(f"✅ Message sent to group: {message}")
        except Exception as e:
            print(f"❌ Error in receive: {e}")

    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        receiver_id = event['receiver_id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id,
            'receiver_id': receiver_id
        }))
        print(f"📤 Sent to client: {message}")

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, message):
        try:
            sender = User.objects.get(id=sender_id)
            receiver = User.objects.get(id=receiver_id)
            ChatMessage.objects.create(
                sender=sender,
                receiver=receiver,
                message=message
            )
            print(f"💾 Message saved: {message}")
        except Exception as e:
            print(f"❌ Error saving message: {e}")