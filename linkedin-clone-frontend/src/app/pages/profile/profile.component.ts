import { Component, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, ProfileUpdateData } from '../../services/auth.service';
import { PostService, Post, Comment, CreateCommentData } from '../../services/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: any;
  isEditing: boolean = false;
  editData: any = {
    first_name: '',
    last_name: '',
    email: '',
    bio: ''
  };
  selectedFile: File | null = null;
  photoPreviewUrl: string | ArrayBuffer | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  private platformId = inject(PLATFORM_ID);

  // User posts
  userPosts: Post[] = [];
  isLoadingPosts: boolean = false;
  postsError: string = '';

  // Comment form
  commentContent: { [postId: number]: string } = {};
  showCommentForm: { [postId: number]: boolean } = {};

  private postsSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserProfile();
      this.loadUserPosts();
    }
  }

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  loadUserProfile(): void {
    this.user = this.authService.getUser();
    if (this.user) {
      this.editData = { ...this.user };
    }
  }

  loadUserPosts(): void {
    if (!this.user) return;

    this.isLoadingPosts = true;
    this.postsError = '';

    this.postsSubscription = this.postService.getUserPosts(this.user.id).subscribe({
      next: (posts) => {
        this.userPosts = posts;
        this.isLoadingPosts = false;
      },
      error: (error) => {
        this.postsError = 'Failed to load posts. Please try again.';
        this.isLoadingPosts = false;
        console.error('Error loading user posts:', error);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editData = { ...this.user };
      this.selectedFile = null;
      this.photoPreviewUrl = null;
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.photoPreviewUrl = null;
    }
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.photoPreviewUrl = null;
    // Optionally, send a request to backend to remove existing photo
  }

  saveProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData: ProfileUpdateData = {
      first_name: this.editData.first_name,
      last_name: this.editData.last_name,
      email: this.editData.email,
      bio: this.editData.bio
    };

    if (this.selectedFile) {
      updateData.profile_photo = this.selectedFile;
    }

    this.authService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.user = response.user;
        this.isLoading = false;
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully!';
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  // Post management methods
  deletePost(post: Post): void {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    this.postService.deletePost(post.id).subscribe({
      next: (response) => {
        // Remove the post from the array
        this.userPosts = this.userPosts.filter(p => p.id !== post.id);
        this.successMessage = 'Post deleted successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete post. Please try again.';
        console.error('Error deleting post:', error);
      }
    });
  }

  likePost(post: Post): void {
    this.postService.likePost(post.id).subscribe({
      next: (response) => {
        // Update the post in the array
        const index = this.userPosts.findIndex(p => p.id === post.id);
        if (index !== -1) {
          this.userPosts[index] = response.post;
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
        const index = this.userPosts.findIndex(p => p.id === post.id);
        if (index !== -1) {
          this.userPosts[index].comments.push(response.comment);
          this.userPosts[index].comments_count = this.userPosts[index].comments.length;
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
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    this.postService.deleteComment(comment.id).subscribe({
      next: (response) => {
        // Remove the comment from the post
        const postIndex = this.userPosts.findIndex(p => p.id === post.id);
        if (postIndex !== -1) {
          this.userPosts[postIndex].comments = this.userPosts[postIndex].comments.filter(c => c.id !== comment.id);
          this.userPosts[postIndex].comments_count = this.userPosts[postIndex].comments.length;
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

  isCurrentUserComment(comment: Comment): boolean {
    return this.user && comment.author === this.user.id;
  }

  getProfileCompletion(): number {
    if (!this.user) return 0;
    
    let completion = 0;
    const totalFields = 5;
    
    if (this.user.first_name && this.user.last_name) completion += 20;
    if (this.user.email) completion += 20;
    if (this.user.bio) completion += 20;
    if (this.user.profile_photo) completion += 20;
    completion += 20; // Placeholder for location
    
    return Math.min(completion, 100);
  }
}
