# from rest_framework import generics, status
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from .models import Post, Comment
# from .serializers import PostSerializer, PostCreateSerializer, CommentCreateSerializer

# class PostListCreateView(generics.ListCreateAPIView):
#     queryset = Post.objects.all()
#     permission_classes = [IsAuthenticated]

#     def get_serializer_class(self):
#         if self.request.method == 'POST':
#             return PostCreateSerializer
#         return PostSerializer

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

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
#             return Response({
#                 'id': comment.id,
#                 'user': {
#                     'id': comment.user.id,
#                     'username': comment.user.username,
#                     'avatar': comment.user.avatar
#                 },
#                 'content': comment.content,
#                 'created_at': comment.created_at
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     except Post.DoesNotExist:
#         return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# class UserPostsView(generics.ListAPIView):
#     serializer_class = PostSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user_id = self.kwargs['user_id']
#         return Post.objects.filter(user_id=user_id)
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        if post.likes.filter(id=request.user.id).exists():
            post.likes.remove(request.user)
            is_liked = False
        else:
            post.likes.add(request.user)
            is_liked = True
        
        return Response({
            'is_liked': is_liked,
            'likes_count': post.likes_count()
        })
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
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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