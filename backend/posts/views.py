# # # # from rest_framework import generics, status
# # # # from rest_framework.decorators import api_view, permission_classes
# # # # from rest_framework.permissions import IsAuthenticated
# # # # from rest_framework.response import Response
# # # # from .models import Post, Comment
# # # # from .serializers import PostSerializer, PostCreateSerializer, CommentCreateSerializer

# # # # class PostListCreateView(generics.ListCreateAPIView):
# # # #     queryset = Post.objects.all()
# # # #     permission_classes = [IsAuthenticated]

# # # #     def get_serializer_class(self):
# # # #         if self.request.method == 'POST':
# # # #             return PostCreateSerializer
# # # #         return PostSerializer

# # # #     def perform_create(self, serializer):
# # # #         serializer.save(user=self.request.user)

# # # # @api_view(['POST'])
# # # # @permission_classes([IsAuthenticated])
# # # # def like_post(request, post_id):
# # # #     try:
# # # #         post = Post.objects.get(id=post_id)
# # # #         if post.likes.filter(id=request.user.id).exists():
# # # #             post.likes.remove(request.user)
# # # #             is_liked = False
# # # #         else:
# # # #             post.likes.add(request.user)
# # # #             is_liked = True
        
# # # #         return Response({
# # # #             'is_liked': is_liked,
# # # #             'likes_count': post.likes_count()
# # # #         })
# # # #     except Post.DoesNotExist:
# # # #         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# # # # @api_view(['POST'])
# # # # @permission_classes([IsAuthenticated])
# # # # def add_comment(request, post_id):
# # # #     try:
# # # #         post = Post.objects.get(id=post_id)
# # # #         serializer = CommentCreateSerializer(data=request.data)
# # # #         if serializer.is_valid():
# # # #             comment = serializer.save(user=request.user, post=post)
# # # #             return Response({
# # # #                 'id': comment.id,
# # # #                 'user': {
# # # #                     'id': comment.user.id,
# # # #                     'username': comment.user.username,
# # # #                     'avatar': comment.user.avatar
# # # #                 },
# # # #                 'content': comment.content,
# # # #                 'created_at': comment.created_at
# # # #             }, status=status.HTTP_201_CREATED)
# # # #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# # # #     except Post.DoesNotExist:
# # # #         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# # # # class UserPostsView(generics.ListAPIView):
# # # #     serializer_class = PostSerializer
# # # #     permission_classes = [IsAuthenticated]

# # # #     def get_queryset(self):
# # # #         user_id = self.kwargs['user_id']
# # # #         return Post.objects.filter(user_id=user_id)
# # # from rest_framework import generics, status
# # # from rest_framework.decorators import api_view, permission_classes
# # # from rest_framework.permissions import IsAuthenticated
# # # from rest_framework.response import Response
# # # from .models import Post, Comment
# # # from .serializers import PostSerializer, PostCreateSerializer, CommentCreateSerializer, CommentSerializer

# # # class PostListCreateView(generics.ListCreateAPIView):
# # #     queryset = Post.objects.all()
# # #     permission_classes = [IsAuthenticated]

# # #     def get_serializer_class(self):
# # #         if self.request.method == 'POST':
# # #             return PostCreateSerializer
# # #         return PostSerializer

# # #     def get_serializer_context(self):
# # #         return {'request': self.request}

# # #     def perform_create(self, serializer):
# # #         serializer.save(user=self.request.user)

# # #     def create(self, request, *args, **kwargs):
# # #         serializer = self.get_serializer(data=request.data)
# # #         if serializer.is_valid():
# # #             post = serializer.save(user=request.user)
# # #             # Return the full post data with user info
# # #             response_serializer = PostSerializer(post, context={'request': request})
# # #             return Response(response_serializer.data, status=status.HTTP_201_CREATED)
# # #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # # @api_view(['POST'])
# # # @permission_classes([IsAuthenticated])
# # # def like_post(request, post_id):
# # #     try:
# # #         post = Post.objects.get(id=post_id)
# # #         if post.likes.filter(id=request.user.id).exists():
# # #             post.likes.remove(request.user)
# # #             is_liked = False
# # #         else:
# # #             post.likes.add(request.user)
# # #             is_liked = True
        
# # #         return Response({
# # #             'is_liked': is_liked,
# # #             'likes_count': post.likes_count()
# # #         })
# # #     except Post.DoesNotExist:
# # #         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# # # @api_view(['POST'])
# # # @permission_classes([IsAuthenticated])
# # # def add_comment(request, post_id):
# # #     try:
# # #         post = Post.objects.get(id=post_id)
# # #         serializer = CommentCreateSerializer(data=request.data)
# # #         if serializer.is_valid():
# # #             comment = serializer.save(user=request.user, post=post)
# # #             # Return full comment data with user info
# # #             response_serializer = CommentSerializer(comment)
# # #             return Response(response_serializer.data, status=status.HTTP_201_CREATED)
# # #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# # #     except Post.DoesNotExist:
# # #         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# # # class UserPostsView(generics.ListAPIView):
# # #     serializer_class = PostSerializer
# # #     permission_classes = [IsAuthenticated]

# # #     def get_queryset(self):
# # #         user_id = self.kwargs['user_id']
# # #         return Post.objects.filter(user_id=user_id)

# # #     def get_serializer_context(self):
# # #         return {'request': self.request}

# # from rest_framework import generics, status
# # from rest_framework.decorators import api_view, permission_classes
# # from rest_framework.permissions import IsAuthenticated
# # from rest_framework.response import Response
# # from channels.layers import get_channel_layer
# # from asgiref.sync import async_to_sync
# # from .models import Post, Comment
# # from .serializers import PostSerializer, PostCreateSerializer, CommentCreateSerializer, CommentSerializer



# # class PostListCreateView(generics.ListCreateAPIView):
# #     queryset = Post.objects.all()
# #     permission_classes = [IsAuthenticated]

# #     def get_serializer_class(self):
# #         if self.request.method == 'POST':
# #             return PostCreateSerializer
# #         return PostSerializer

# #     def get_serializer_context(self):
# #         return {'request': self.request}

# #     def perform_create(self, serializer):
# #         serializer.save(user=self.request.user)

# #     def create(self, request, *args, **kwargs):
# #         serializer = self.get_serializer(data=request.data)
# #         if serializer.is_valid():
# #             post = serializer.save(user=request.user)
# #             # Return the full post data with user info
# #             response_serializer = PostSerializer(post, context={'request': request})
# #             post_data = response_serializer.data
            
# #             # Broadcast new post to all connected clients
# #             broadcast_to_feed('post_created', {
# #                 'post': post_data
# #             })
            
# #             return Response(post_data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def like_post(request, post_id):
# #     try:
# #         post = Post.objects.get(id=post_id)
# #         was_liked = post.likes.filter(id=request.user.id).exists()
        
# #         if was_liked:
# #             post.likes.remove(request.user)
# #             is_liked = False
# #         else:
# #             post.likes.add(request.user)
# #             is_liked = True
        
# #         response_data = {
# #             'is_liked': is_liked,
# #             'likes_count': post.likes_count()
# #         }
        
# #         # Broadcast like update to all connected clients
# #         broadcast_to_feed('post_updated', {
# #             'post_id': post_id,
# #             'updates': response_data
# #         })
        
# #         return Response(response_data)
# #     except Post.DoesNotExist:
# #         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def add_comment(request, post_id):
# #     try:
# #         post = Post.objects.get(id=post_id)
# #         serializer = CommentCreateSerializer(data=request.data)
# #         if serializer.is_valid():
# #             comment = serializer.save(user=request.user, post=post)
# #             # Return full comment data with user info
# #             response_serializer = CommentSerializer(comment)
# #             comment_data = response_serializer.data
            
# #             # Broadcast new comment to all connected clients
# #             broadcast_to_feed('comment_added', {
# #                 'post_id': post_id,
# #                 'comment': comment_data
# #             })
            
# #             return Response(comment_data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# #     except Post.DoesNotExist:
# #         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# # @api_view(['DELETE'])
# # @permission_classes([IsAuthenticated])
# # def delete_post(request, post_id):
# #     try:
# #         post = Post.objects.get(id=post_id)
        
# #         # Check if user owns the post
# #         if post.user != request.user:
# #             return Response({'error': 'You can only delete your own posts'}, 
# #                           status=status.HTTP_403_FORBIDDEN)
        
# #         post.delete()
        
# #         # Broadcast post deletion to all connected clients
# #         broadcast_to_feed('post_deleted', {
# #             'post_id': post_id
# #         })
        
# #         return Response({'message': 'Post deleted successfully'}, 
# #                        status=status.HTTP_204_NO_CONTENT)
# #     except Post.DoesNotExist:
# #         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# # class UserPostsView(generics.ListAPIView):
# #     serializer_class = PostSerializer
# #     permission_classes = [IsAuthenticated]

# #     def get_queryset(self):
# #         user_id = self.kwargs['user_id']
# #         return Post.objects.filter(user_id=user_id)

# #     def get_serializer_context(self):
# #         return {'request': self.request}

# from rest_framework import generics, status
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from .models import Post, Comment
# from .serializers import PostSerializer, PostCreateSerializer, CommentCreateSerializer, CommentSerializer

# # Placeholder function for WebSocket broadcasting
# # You'll need to implement this based on your WebSocket setup
# def broadcast_to_feed(event_type, data):
#     """
#     Placeholder for WebSocket broadcasting
#     Replace this with your actual WebSocket implementation
#     """
#     try:
#         # If you're using Django Channels, you might do something like:
#         # from channels.layers import get_channel_layer
#         # from asgiref.sync import async_to_sync
#         # 
#         # channel_layer = get_channel_layer()
#         # async_to_sync(channel_layer.group_send)(
#         #     'feed_updates',
#         #     {
#         #         'type': 'feed_update',
#         #         'event_type': event_type,
#         #         'data': data
#         #     }
#         # )
#         print(f"Broadcasting {event_type}: {data}")
#     except Exception as e:
#         print(f"Error broadcasting: {e}")

# class PostListCreateView(generics.ListCreateAPIView):
#     queryset = Post.objects.all()
#     permission_classes = [IsAuthenticated]

#     def get_serializer_class(self):
#         if self.request.method == 'POST':
#             return PostCreateSerializer
#         return PostSerializer

#     def get_serializer_context(self):
#         return {'request': self.request}

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             post = serializer.save(user=request.user)
#             # Return the full post data with user info
#             response_serializer = PostSerializer(post, context={'request': request})
#             post_data = response_serializer.data
            
#             # Broadcast new post to all connected clients
#             broadcast_to_feed('post_created', {
#                 'post': post_data
#             })
            
#             return Response(post_data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def like_post(request, post_id):
#     try:
#         post = Post.objects.get(id=post_id)
#         was_liked = post.likes.filter(id=request.user.id).exists()
        
#         if was_liked:
#             post.likes.remove(request.user)
#             is_liked = False
#         else:
#             post.likes.add(request.user)
#             is_liked = True
        
#         response_data = {
#             'is_liked': is_liked,
#             'likes_count': post.likes_count()
#         }
        
#         # Broadcast like update to all connected clients
#         broadcast_to_feed('post_updated', {
#             'post_id': post_id,
#             'updates': response_data
#         })
        
#         return Response(response_data)
#     except Post.DoesNotExist:
#         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_comment(request, post_id):
#     try:
#         post = Post.objects.get(id=post_id)
#         serializer = CommentCreateSerializer(data=request.data)
#         if serializer.is_valid():
#             comment = serializer.save(user=request.user, post=post)
#             # Return full comment data with user info
#             response_serializer = CommentSerializer(comment)
#             comment_data = response_serializer.data
            
#             # Broadcast new comment to all connected clients
#             broadcast_to_feed('comment_added', {
#                 'post_id': post_id,
#                 'comment': comment_data
#             })
            
#             return Response(comment_data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     except Post.DoesNotExist:
#         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# @api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
# def delete_post(request, post_id):
#     try:
#         post = Post.objects.get(id=post_id)
        
#         # Check if user owns the post
#         if post.user != request.user:
#             return Response({'error': 'You can only delete your own posts'}, 
#                           status=status.HTTP_403_FORBIDDEN)
        
#         post.delete()
        
#         # Broadcast post deletion to all connected clients
#         broadcast_to_feed('post_deleted', {
#             'post_id': post_id
#         })
        
#         return Response({'message': 'Post deleted successfully'}, 
#                        status=status.HTTP_204_NO_CONTENT)
#     except Post.DoesNotExist:
#         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# class UserPostsView(generics.ListAPIView):
#     serializer_class = PostSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user_id = self.kwargs['user_id']
#         return Post.objects.filter(user_id=user_id)

#     def get_serializer_context(self):
#         return {'request': self.request}

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db import models
from datetime import datetime
from .models import Post, Comment
from .serializers import PostSerializer, PostCreateSerializer, CommentCreateSerializer, CommentSerializer

class PostListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = Post.objects.all()
        
        # Support for polling - get posts updated since timestamp
        since_param = self.request.query_params.get('since')
        if since_param:
            try:
                # Convert timestamp to datetime
                since_timestamp = int(since_param) / 1000  # Convert from milliseconds
                since_datetime = datetime.fromtimestamp(since_timestamp, tz=timezone)
                
                # Get posts that were created or updated since the timestamp
                queryset = queryset.filter(
                    models.Q(created_at__gt=since_datetime) | 
                    models.Q(updated_at__gt=since_datetime)
                )
            except (ValueError, TypeError):
                # If timestamp is invalid, return empty queryset
                pass
        
        return queryset.select_related('user').prefetch_related('comments__user', 'likes')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save(user=request.user)
            # Return the full post data with user info
            response_serializer = PostSerializer(post, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        was_liked = post.likes.filter(id=request.user.id).exists()
        
        if was_liked:
            post.likes.remove(request.user)
            is_liked = False
        else:
            post.likes.add(request.user)
            is_liked = True
        
        # Update the post's updated_at timestamp for polling
        post.save(update_fields=['updated_at'])
        
        response_data = {
            'is_liked': is_liked,
            'likes_count': post.likes_count(),
            'updated_at': post.updated_at.isoformat()
        }
        
        return Response(response_data)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        serializer = CommentCreateSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(user=request.user, post=post)
            
            # Update the post's updated_at timestamp for polling
            post.save(update_fields=['updated_at'])
            
            # Return full comment data with user info
            response_serializer = CommentSerializer(comment)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        
        # Check if user owns the post
        if post.user != request.user:
            return Response({'error': 'You can only delete your own posts'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        post.delete()
        
        return Response({'message': 'Post deleted successfully'}, 
                       status=status.HTTP_204_NO_CONTENT)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_feed_updates(request):
    """
    Endpoint specifically for checking feed updates
    More efficient than fetching all posts
    """
    try:
        since_param = request.query_params.get('since')
        if not since_param:
            return Response({'error': 'since parameter is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Convert timestamp to datetime
        since_timestamp = int(since_param) / 1000
        since_datetime = datetime.fromtimestamp(since_timestamp, tz=timezone.utc)
        
        # Get updated posts
        updated_posts = Post.objects.filter(
            models.Q(created_at__gt=since_datetime) | 
            models.Q(updated_at__gt=since_datetime)
        ).select_related('user').prefetch_related('comments__user', 'likes')
        
        # Get deleted posts (you might want to implement a soft delete system)
        # For now, we'll just return updated posts
        
        serializer = PostSerializer(updated_posts, many=True, context={'request': request})
        
        return Response({
            'posts': serializer.data,
            'timestamp': int(timezone.now().timestamp() * 1000),  # Current timestamp in milliseconds
            'count': len(serializer.data)
        })
        
    except (ValueError, TypeError):
        return Response({'error': 'Invalid timestamp format'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Post.objects.filter(user_id=user_id).select_related('user').prefetch_related('comments__user', 'likes')

    def get_serializer_context(self):
        return {'request': self.request}

# Alternative: Server-Sent Events (SSE) endpoint for real-time updates
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def feed_events(request):
    """
    Server-Sent Events endpoint for real-time feed updates
    This provides a more efficient alternative to polling
    """
    from django.http import StreamingHttpResponse
    import json
    import time
    
    def event_stream():
        last_check = timezone.now()
        
        while True:
            # Check for new posts/updates
            updated_posts = Post.objects.filter(
                models.Q(created_at__gt=last_check) | 
                models.Q(updated_at__gt=last_check)
            ).select_related('user').prefetch_related('comments__user', 'likes')
            
            if updated_posts.exists():
                serializer = PostSerializer(updated_posts, many=True, context={'request': request})
                data = {
                    'type': 'feed_update',
                    'posts': serializer.data,
                    'timestamp': int(timezone.now().timestamp() * 1000)
                }
                yield f"data: {json.dumps(data)}\n\n"
            
            last_check = timezone.now()
            time.sleep(3)  # Check every 3 seconds
    
    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['Connection'] = 'keep-alive'
    response['Access-Control-Allow-Origin'] = '*'
    return response