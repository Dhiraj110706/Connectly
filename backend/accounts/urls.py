# # accounts/urls.py
# from django.urls import path
# from . import views

# urlpatterns = [
#     # Authentication
#     path('register/', views.register, name='register'),
#     path('login/', views.login, name='login'),
#     path('logout/', views.logout, name='logout'),
#     path('profile/', views.get_profile, name='get_profile'),
#     path('profile/update/', views.update_profile, name='update_profile'),
    
#     # Users and Social Features
#     path('users/', views.all_users, name='all_users'),  # All users
#     path('users/explore/', views.explore_users, name='explore_users'),  # Users not followed
#     path('follow/<int:user_id>/', views.follow_user, name='follow_user'),
    
#     # Add more endpoints as needed
# ]

# from django.urls import path
# from . import views

# urlpatterns = [
#     path('register/', views.register, name='register'),
#     path('login/', views.login, name='login'),
#     path('profile/', views.profile, name='profile'),
#     path('follow/<int:user_id>/', views.follow_user, name='follow_user'),
#     path('users/', views.UserListView.as_view(), name='user_list'),
#     path('users/explore/', views.explore_users, name='explore_users'),  # NEW: For explore page
#     path('users/<int:user_id>/followers',views.user_followers,name='user_following'),
# ]

from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('follow/<int:user_id>/', views.follow_user, name='follow_user'),
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/<int:user_id>/followers/', views.user_followers, name='user_followers'),
    path('users/<int:user_id>/following/', views.user_following, name='user_following'),
    path('users/explore/', views.explore_users, name='explore_users'),
]