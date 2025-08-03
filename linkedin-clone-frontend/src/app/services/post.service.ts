import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Comment {
  id: number;
  author: number;
  author_name: string;
  author_photo?: string;
  content: string;
  created_at: string;
  created_at_formatted: string;
}

export interface Post {
  id: number;
  author: number;
  author_name: string;
  author_photo?: string;
  content: string;
  image?: string;
  image_url?: string;
  created_at: string;
  created_at_formatted: string;
  likes_count: number;
  is_liked: boolean;
  comments: Comment[];
  comments_count: number;
}

export interface CreatePostData {
  content: string;
  image?: File;
}

export interface CreateCommentData {
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts/`);
  }

  getUserPosts(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts/user/${userId}/`);
  }

  createPost(data: CreatePostData): Observable<Post> {
    const formData = new FormData();
    formData.append('content', data.content);
    
    if (data.image) {
      formData.append('image', data.image);
    }

    return this.http.post<Post>(`${this.apiUrl}/posts/create/`, formData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deletePost(postId: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/posts/${postId}/delete/`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  likePost(postId: number): Observable<{message: string, post: Post}> {
    return this.http.post<{message: string, post: Post}>(`${this.apiUrl}/posts/${postId}/like/`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }

  addComment(postId: number, data: CreateCommentData): Observable<{message: string, comment: Comment}> {
    return this.http.post<{message: string, comment: Comment}>(`${this.apiUrl}/posts/${postId}/comment/`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteComment(commentId: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/comments/${commentId}/delete/`, {
      headers: this.authService.getAuthHeaders()
    });
  }
} 