from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.db.models import Count, Q

from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    LoginSerializer
)

User = get_user_model()

# ----------------- AUTHENTICATION VIEWS ----------------- #

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user, context={'request': request}).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)

# ----------------- USER INTERACTION VIEWS ----------------- #

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, user_id):
    try:
        current_user = request.user
        target_user = User.objects.get(id=user_id)

        if current_user == target_user:
            return Response({'error': 'You cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)

        is_following = current_user.following.filter(id=user_id).exists()

        if is_following:
            current_user.following.remove(target_user)
            is_following = False
            action = 'unfollowed'
        else:
            current_user.following.add(target_user)
            is_following = True
            action = 'followed'

        return Response({
            'is_following': is_following,
            'followers_count': target_user.followers.count(),
            'action': action,
            'message': f'Successfully {action} {target_user.username}'
        })

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_followers(request, user_id):
    """Get the followers of a specific user"""
    try:
        user = User.objects.get(id=user_id)
        followers = user.followers.all()
        serializer = UserSerializer(followers, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_following(request, user_id):
    """Get the users that a specific user is following"""
    try:
        user = User.objects.get(id=user_id)
        following = user.following.all()
        serializer = UserSerializer(following, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


# ----------------- USER DISCOVERY & LISTING VIEWS ----------------- #

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def explore_users(request):
    """
    Get users that the current user is NOT following (for explore page)
    """
    try:
        current_user = request.user
        following_ids = current_user.following.values_list('id', flat=True)

        explore_users_queryset = User.objects.exclude(
            Q(id=current_user.id) |
            Q(id__in=following_ids)
        ).annotate(
            followers_count=Count('followers'),
            following_count=Count('following')
        ).order_by('-date_joined')[:20]

        serializer = UserSerializer(explore_users_queryset, many=True, context={'request': request})
        return Response(serializer.data)

    except Exception:
        return Response({'error': 'Failed to fetch explore users'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserListView(generics.ListAPIView):
    """
    Get all users except the current user (with follower/following counts)
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id).annotate(
            followers_count=Count('followers'),
            following_count=Count('following')
        ).order_by('-date_joined')

    def get_serializer_context(self):
        return {'request': self.request}
