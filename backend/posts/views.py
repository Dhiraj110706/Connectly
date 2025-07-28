# # from rest_framework import generics, status
# # from rest_framework.decorators import api_view, permission_classes
# # from rest_framework.permissions import IsAuthenticated
# # from rest_framework.response import Response
# # from .models import Post, Comment
# # from .serializers import PostSerializer, PostCreateSerializer, CommentCreateSerializer

# # class PostListCreateView(generics.ListCreateAPIView):
# #     queryset = Post.objects.all()
# #     permission_classes = [IsAuthenticated]

# #     def get_serializer_class(self):
# #         if self.request.method == 'POST':
# #             return PostCreateSerializer
# #         return PostSerializer

# #     def perform_create(self, serializer):
# #         serializer.save(user=self.request.user)

# # @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# # def like_post(request, post_id):
# #     try:
# #         post = Post.objects.get(id=post_id)
# #         if post.likes.filter(id=request.user.id).exists():
# #             post.likes.remove(request.user)
# #             is_liked = False
# #         else:
# #             post.likes.add(request.user)
# #             is_liked = True
        
# #         return Response({
# #             'is_liked': is_liked,
# #             'likes_count': post.likes_count()
# #         })
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
# #             return Response({
# #                 'id': comment.id,
# #                 'user': {
# #                     'id': comment.user.id,
# #                     'username': comment.user.username,
# #                     'avatar': comment.user.avatar
# #                 },
# #                 'content': comment.content,
# #                 'created_at': comment.created_at
# #             }, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# #     except Post.DoesNotExist:
# #         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# # class UserPostsView(generics.ListAPIView):
# #     serializer_class = PostSerializer
# #     permission_classes = [IsAuthenticated]

# #     def get_queryset(self):
# #         user_id = self.kwargs['user_id']
# #         return Post.objects.filter(user_id=user_id)
# from rest_framework import generics, status
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from .models import Post, Comment
# from .serializers import PostSerializer, PostCreateSerializer, CommentCreateSerializer, CommentSerializer

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
#             return Response(response_serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def like_post(request, post_id):
#     try:
#         post = Post.objects.get(id=post_id)
#         if post.likes.filter(id=request.user.id).exists():
#             post.likes.remove(request.user)
#             is_liked = False
#         else:
#             post.likes.add(request.user)
#             is_liked = True
        
#         return Response({
#             'is_liked': is_liked,
#             'likes_count': post.likes_count()
#         })
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
#             return Response(response_serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Post, Comment
from .serializers import PostSerializer, PostCreateSerializer, CommentCreateSerializer, CommentSerializer



class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save(user=request.user)
            # Return the full post data with user info
            response_serializer = PostSerializer(post, context={'request': request})
            post_data = response_serializer.data
            
            # Broadcast new post to all connected clients
            broadcast_to_feed('post_created', {
                'post': post_data
            })
            
            return Response(post_data, status=status.HTTP_201_CREATED)
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
        
        response_data = {
            'is_liked': is_liked,
            'likes_count': post.likes_count()
        }
        
        # Broadcast like update to all connected clients
        broadcast_to_feed('post_updated', {
            'post_id': post_id,
            'updates': response_data
        })
        
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
            # Return full comment data with user info
            response_serializer = CommentSerializer(comment)
            comment_data = response_serializer.data
            
            # Broadcast new comment to all connected clients
            broadcast_to_feed('comment_added', {
                'post_id': post_id,
                'comment': comment_data
            })
            
            return Response(comment_data, status=status.HTTP_201_CREATED)
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
        
        # Broadcast post deletion to all connected clients
        broadcast_to_feed('post_deleted', {
            'post_id': post_id
        })
        
        return Response({'message': 'Post deleted successfully'}, 
                       status=status.HTTP_204_NO_CONTENT)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

class UserPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Post.objects.filter(user_id=user_id)

    def get_serializer_context(self):
        return {'request': self.request}