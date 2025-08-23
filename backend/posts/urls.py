from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostListCreateView.as_view(), name='post_list_create'),
    path('updates/', views.get_feed_updates, name='feed_updates'),  # New endpoint for efficient polling
    path('events/', views.feed_events, name='feed_events'),  # SSE endpoint (optional)
    path('<int:post_id>/like/', views.like_post, name='like_post'),
    path('<int:post_id>/comment/', views.add_comment, name='add_comment'),
    path('<int:post_id>/delete/', views.delete_post, name='delete_post'),
    path('user/<int:user_id>/', views.UserPostsView.as_view(), name='user_posts'),
]
