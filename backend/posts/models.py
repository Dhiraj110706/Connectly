from django.db import models
from django.conf import settings
import os
import uuid

def post_image_upload_path(instance, filename):
    """Generate upload path for post images"""
    # Get file extension
    ext = filename.split('.')[-1]
    # Create unique filename using UUID to avoid conflicts
    unique_filename = f"{instance.user.id}_{uuid.uuid4().hex[:8]}.{ext}"
    return os.path.join('posts', unique_filename)

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    # Use ImageField for proper file uploads
    image = models.ImageField(upload_to=post_image_upload_path, blank=True, null=True)
    # Keep emoji field separate for emojis/text decorations
    emoji = models.CharField(max_length=10, blank=True, null=True, help_text="Optional emoji or short text")
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def likes_count(self):
        return self.likes.count()

    def is_liked_by(self, user):
        return self.likes.filter(id=user.id).exists()
    
    def has_image(self):
        """Check if the post has an uploaded image"""
        return bool(self.image and hasattr(self.image, 'url'))
    
    def has_emoji(self):
        """Check if the post has emoji/text decoration"""
        return bool(self.emoji)
    
    def get_image_url(self):
        """Get the full URL for the uploaded image"""
        if self.image and hasattr(self.image, 'url'):
            return self.image.url
        return None

    def delete(self, *args, **kwargs):
        """Override delete to remove image file when post is deleted"""
        if self.image and hasattr(self.image, 'path'):
            try:
                if os.path.isfile(self.image.path):
                    os.remove(self.image.path)
            except Exception as e:
                print(f"Error deleting image file: {e}")
        super().delete(*args, **kwargs)

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']