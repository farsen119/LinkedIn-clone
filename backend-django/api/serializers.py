from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    profile_photo = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile_photo', 'bio']
    
    def get_profile_photo(self, obj):
        try:
            if obj.profile.profile_photo:
                return self.context['request'].build_absolute_uri(obj.profile.profile_photo.url)
            return None
        except:
            return None
    
    def get_bio(self, obj):
        try:
            return obj.profile.bio
        except:
            return ''

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile_photo = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'profile_photo']

    def create(self, validated_data):
        # Check if email already exists
        email = validated_data['email']
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'A user with this email already exists.'})
        
        # Extract profile photo from validated data
        profile_photo = validated_data.pop('profile_photo', None)
        
        # Generate username from email
        username = email.split('@')[0]
        
        # Ensure username is unique
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        validated_data['username'] = username
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user, bio='', profile_photo=profile_photo)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Use filter().first() instead of get() to handle multiple users with same email
            user = User.objects.filter(email=email).first()
            if not user:
                raise serializers.ValidationError('Invalid credentials.')
            
            # Try to authenticate with the found user
            authenticated_user = authenticate(username=user.username, password=password)
            if not authenticated_user:
                raise serializers.ValidationError('Invalid credentials.')
            
            attrs['user'] = authenticated_user
            return attrs
        else:
            raise serializers.ValidationError('Must include email and password.')

class ProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    profile_photo = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = ['bio', 'profile_photo', 'first_name', 'last_name', 'email']

    def update(self, instance, validated_data):
        # Update user fields
        user_data = validated_data.pop('user', {})
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance 