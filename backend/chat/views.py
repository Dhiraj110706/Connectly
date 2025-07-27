from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import ChatMessage
from .serializers import ChatMessageSerializer

User = get_user_model()

class ChatMessageListView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_user_id = self.request.query_params.get('user_id')
        
        if other_user_id:
            return ChatMessage.objects.filter(
                Q(sender=user, receiver_id=other_user_id) |
                Q(sender_id=other_user_id, receiver=user)
            ).order_by('timestamp')
        
        return ChatMessage.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('timestamp')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    receiver_id = request.data.get('receiver_id')
    message = request.data.get('message')
    
    if not receiver_id or not message:
        return Response({'error': 'receiver_id and message required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        receiver = User.objects.get(id=receiver_id)
        chat_message = ChatMessage.objects.create(
            sender=request.user,
            receiver=receiver,
            message=message
        )
        
        serializer = ChatMessageSerializer(chat_message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({'error': 'Receiver not found'}, 
                       status=status.HTTP_404_NOT_FOUND)