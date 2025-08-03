from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from .models import Profile
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, ProfileUpdateSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': UserSerializer(user, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': UserSerializer(user, context={'request': request}).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def refresh_token(request):
    try:
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        refresh = RefreshToken(refresh_token)
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        })
    except Exception as e:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    try:
        user = request.user
        profile = Profile.objects.get(user=user)
        
        serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            # Return updated user data
            return Response({
                'message': 'Profile updated successfully',
                'user': UserSerializer(user, context={'request': request}).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': 'An error occurred while updating profile'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 