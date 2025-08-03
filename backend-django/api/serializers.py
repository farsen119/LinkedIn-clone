from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        # Check if email already exists
        email = validated_data['email']
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'A user with this email already exists.'})
        
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
        Profile.objects.create(user=user, bio='')
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