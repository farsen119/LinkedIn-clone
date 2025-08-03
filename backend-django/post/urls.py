from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.get_posts, name='get_posts'),
    path('posts/user/<int:user_id>/', views.get_user_posts, name='get_user_posts'),
    path('posts/create/', views.create_post, name='create_post'),
    path('posts/<int:post_id>/delete/', views.delete_post, name='delete_post'),
    path('posts/<int:post_id>/like/', views.like_post, name='like_post'),
    path('posts/<int:post_id>/comment/', views.add_comment, name='add_comment'),
    path('comments/<int:comment_id>/delete/', views.delete_comment, name='delete_comment'),
] 