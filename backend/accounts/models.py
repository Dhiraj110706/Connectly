# from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    avatar = models.CharField(max_length=10, default='👤')
    bio = models.TextField(max_length=500, blank=True)
    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def followers_count(self):
        return self.followers.count()

    def following_count(self):
        return self.following.count()

    def __str__(self):
        return self.username