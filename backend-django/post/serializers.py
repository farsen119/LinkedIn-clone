from rest_framework import serializers
from .models import Post, Comment

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_photo = serializers.SerializerMethodField()
    created_at_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_name', 'author_photo', 'content', 'created_at', 'created_at_formatted']
        read_only_fields = ['author', 'created_at']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username

    def get_author_photo(self, obj):
        try:
            if obj.author.profile.profile_photo:
                return self.context['request'].build_absolute_uri(obj.author.profile.profile_photo.url)
            return None
        except:
            return None

    def get_created_at_formatted(self, obj):
        ist_time = obj.get_ist_time()
        return ist_time.strftime('%B %d, %Y at %I:%M %p IST')

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_photo = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    created_at_formatted = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_name', 'author_photo', 'content', 'image', 'image_url', 'created_at', 'created_at_formatted', 'likes_count', 'is_liked', 'comments', 'comments_count']
        read_only_fields = ['author', 'created_at']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username

    def get_author_photo(self, obj):
        try:
            if obj.author.profile.profile_photo:
                return self.context['request'].build_absolute_uri(obj.author.profile.profile_photo.url)
            return None
        except:
            return None

    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

    def get_created_at_formatted(self, obj):
        ist_time = obj.get_ist_time()
        return ist_time.strftime('%B %d, %Y at %I:%M %p IST')

    def get_likes_count(self, obj):
        return obj.get_likes_count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_liked_by(request.user)
        return False

    def get_comments_count(self, obj):
        return obj.comments.count()

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data) 