from django.contrib import admin
from .models import Post, Comment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['author', 'content', 'created_at', 'likes_count']
    list_filter = ['created_at', 'author']
    search_fields = ['content', 'author__username', 'author__first_name', 'author__last_name']
    readonly_fields = ['created_at', 'updated_at']
    
    def likes_count(self, obj):
        return obj.get_likes_count()
    likes_count.short_description = 'Likes'

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'post', 'content', 'created_at']
    list_filter = ['created_at', 'author', 'post']
    search_fields = ['content', 'author__username', 'post__content']
    readonly_fields = ['created_at', 'updated_at']
