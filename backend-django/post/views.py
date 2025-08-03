from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_posts(request):
    """Get all posts with author details"""
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_user_posts(request, user_id):
    """Get posts by a specific user"""
    try:
        posts = Post.objects.filter(author_id=user_id)
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_post(request):
    """Create a new post"""
    serializer = PostSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_post(request, post_id):
    """Delete a post (only by the post author)"""
    try:
        post = Post.objects.get(id=post_id)
        
        # Check if user is the post author
        if post.author != request.user:
            return Response({'error': 'You can only delete your own posts'}, status=status.HTTP_403_FORBIDDEN)
        
        post.delete()
        return Response({'message': 'Post deleted successfully'}, status=status.HTTP_200_OK)
        
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_post(request, post_id):
    """Like or unlike a post"""
    try:
        post = Post.objects.get(id=post_id)
        user = request.user
        
        if post.likes.filter(id=user.id).exists():
            # Unlike
            post.likes.remove(user)
            action = 'unliked'
        else:
            # Like
            post.likes.add(user)
            action = 'liked'
        
        serializer = PostSerializer(post, context={'request': request})
        return Response({
            'message': f'Post {action} successfully',
            'post': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_comment(request, post_id):
    """Add a comment to a post"""
    try:
        post = Post.objects.get(id=post_id)
        serializer = CommentSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save(post=post)
            return Response({
                'message': 'Comment added successfully',
                'comment': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_comment(request, comment_id):
    """Delete a comment (only by the comment author)"""
    try:
        comment = Comment.objects.get(id=comment_id)
        
        # Check if user is the comment author
        if comment.author != request.user:
            return Response({'error': 'You can only delete your own comments'}, status=status.HTTP_403_FORBIDDEN)
        
        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_200_OK)
        
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
