from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import pytz

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(max_length=1000)
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.author.username}'s post - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    def get_ist_time(self):
        """Convert UTC time to Indian Standard Time"""
        ist = pytz.timezone('Asia/Kolkata')
        return self.created_at.astimezone(ist)

    def get_likes_count(self):
        return self.likes.count()

    def is_liked_by(self, user):
        return self.likes.filter(id=user.id).exists()

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.author.username}'s comment on {self.post.author.username}'s post"

    def get_ist_time(self):
        """Convert UTC time to Indian Standard Time"""
        ist = pytz.timezone('Asia/Kolkata')
        return self.created_at.astimezone(ist)
