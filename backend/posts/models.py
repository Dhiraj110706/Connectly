# # from django.db import models
# # from django.conf import settings

# # class Post(models.Model):
# #     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
# #     content = models.TextField()
# #     image = models.CharField(max_length=255, blank=True, null=True)
# #     likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
# #     created_at = models.DateTimeField(auto_now_add=True)
# #     updated_at = models.DateTimeField(auto_now=True)

# #     class Meta:
# #         ordering = ['-created_at']

# #     def likes_count(self):
# #         return self.likes.count()

# #     def is_liked_by(self, user):
# #         return self.likes.filter(id=user.id).exists()

# # class Comment(models.Model):
# #     post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
# #     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
# #     content = models.TextField()
# #     created_at = models.DateTimeField(auto_now_add=True)

# #     class Meta:
# #         ordering = ['created_at']

# from django.db import models
# from django.conf import settings

# class Post(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
#     content = models.TextField()
#     # Changed to support both image files and URLs
#     image = models.CharField(max_length=500, blank=True, null=True, help_text="Image URL or emoji")
#     # Alternative: Use ImageField for file uploads
#     # image_file = models.ImageField(upload_to='posts/', blank=True, null=True)
#     likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     class Meta:
#         ordering = ['-created_at']

#     def likes_count(self):
#         return self.likes.count()

#     def is_liked_by(self, user):
#         return self.likes.filter(id=user.id).exists()
    
#     def is_image_url(self):
#         """Check if the image field contains a valid image URL"""
#         if not self.image:
#             return False
        
#         # Check if it's a URL
#         if self.image.startswith(('http://', 'https://')):
#             # Check if it ends with common image extensions
#             return self.image.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'))
        
#         return False
    
#     def is_emoji(self):
#         """Check if the image field contains an emoji or short text"""
#         if not self.image:
#             return False
        
#         # If it's not a URL and is short, treat as emoji/text
#         return not self.is_image_url() and len(self.image) <= 10

# class Comment(models.Model):
#     post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['created_at']


from django.db import models
from django.conf import settings
import os

def post_image_upload_path(instance, filename):
    """Generate upload path for post images"""
    # Get file extension
    ext = filename.split('.')[-1]
    # Create filename: user_id_timestamp.ext
    filename = f"{instance.user.id}_{instance.id or 'temp'}_{filename}"
    return os.path.join('posts', filename)

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
        return bool(self.image)
    
    def has_emoji(self):
        """Check if the post has emoji/text decoration"""
        return bool(self.emoji)
    
    def get_image_url(self):
        """Get the full URL for the uploaded image"""
        if self.image:
            return self.image.url
        return None

    def delete(self, *args, **kwargs):
        """Override delete to remove image file when post is deleted"""
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        super().delete(*args, **kwargs)

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']