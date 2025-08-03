import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService, Post, CreatePostData, Comment, CreateCommentData } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  currentUser: any;
  isLoading: boolean = false;
  isCreatingPost: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // New post form
  newPostContent: string = '';
  selectedImage: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  // Comment form
  commentContent: { [postId: number]: string } = {};
  showCommentForm: { [postId: number]: boolean } = {};

  private postsSubscription?: Subscription;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadPosts();
  }

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  loadPosts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.postsSubscription = this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load posts. Please try again.';
        this.isLoading = false;
        console.error('Error loading posts:', error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    } else {
      this.selectedImage = null;
      this.imagePreviewUrl = null;
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreviewUrl = null;
  }

  createPost(): void {
    if (!this.newPostContent.trim()) {
      this.errorMessage = 'Please enter some content for your post.';
      return;
    }

    this.isCreatingPost = true;
    this.errorMessage = '';

    const postData: CreatePostData = {
      content: this.newPostContent.trim()
    };

    if (this.selectedImage) {
      postData.image = this.selectedImage;
    }

    this.postService.createPost(postData).subscribe({
      next: (newPost) => {
        this.posts.unshift(newPost); // Add new post at the beginning
        this.newPostContent = '';
        this.selectedImage = null;
        this.imagePreviewUrl = null;
        this.isCreatingPost = false;
        this.successMessage = 'Post created successfully!';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isCreatingPost = false;
        this.errorMessage = error.error?.message || 'Failed to create post. Please try again.';
        console.error('Error creating post:', error);
      }
    });
  }

  likePost(post: Post): void {
    if (!this.currentUser) {
      this.errorMessage = 'Please login to like posts.';
      return;
    }

    this.postService.likePost(post.id).subscribe({
      next: (response) => {
        // Update the post in the array
        const index = this.posts.findIndex(p => p.id === post.id);
        if (index !== -1) {
          this.posts[index] = response.post;
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to like post. Please try again.';
        console.error('Error liking post:', error);
      }
    });
  }

  toggleCommentForm(postId: number): void {
    this.showCommentForm[postId] = !this.showCommentForm[postId];
    if (!this.commentContent[postId]) {
      this.commentContent[postId] = '';
    }
  }

  addComment(post: Post): void {
    if (!this.currentUser) {
      this.errorMessage = 'Please login to comment.';
      return;
    }

    const content = this.commentContent[post.id]?.trim();
    if (!content) {
      this.errorMessage = 'Please enter a comment.';
      return;
    }

    const commentData: CreateCommentData = {
      content: content
    };

    this.postService.addComment(post.id, commentData).subscribe({
      next: (response) => {
        // Add the new comment to the post
        const index = this.posts.findIndex(p => p.id === post.id);
        if (index !== -1) {
          this.posts[index].comments.push(response.comment);
          this.posts[index].comments_count = this.posts[index].comments.length;
        }
        
        // Clear the comment form
        this.commentContent[post.id] = '';
        this.showCommentForm[post.id] = false;
        
        this.successMessage = 'Comment added successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to add comment. Please try again.';
        console.error('Error adding comment:', error);
      }
    });
  }

  deleteComment(post: Post, comment: Comment): void {
    if (!this.currentUser || comment.author !== this.currentUser.id) {
      this.errorMessage = 'You can only delete your own comments.';
      return;
    }

    this.postService.deleteComment(comment.id).subscribe({
      next: (response) => {
        // Remove the comment from the post
        const postIndex = this.posts.findIndex(p => p.id === post.id);
        if (postIndex !== -1) {
          this.posts[postIndex].comments = this.posts[postIndex].comments.filter(c => c.id !== comment.id);
          this.posts[postIndex].comments_count = this.posts[postIndex].comments.length;
        }
        
        this.successMessage = 'Comment deleted successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete comment. Please try again.';
        console.error('Error deleting comment:', error);
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  isCurrentUserPost(post: Post): boolean {
    return this.currentUser && post.author === this.currentUser.id;
  }

  isCurrentUserComment(comment: Comment): boolean {
    return this.currentUser && comment.author === this.currentUser.id;
  }
}
