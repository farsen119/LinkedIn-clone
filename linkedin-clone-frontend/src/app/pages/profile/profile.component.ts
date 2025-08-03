import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, ProfileUpdateData } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Form data for editing
  editData = {
    first_name: '',
    last_name: '',
    email: '',
    bio: ''
  };

  // Profile photo
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.user = this.authService.getUser();
    if (this.user) {
      this.editData = {
        first_name: this.user.first_name || '',
        last_name: this.user.last_name || '',
        email: this.user.email || '',
        bio: this.user.bio || ''
      };
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form data when canceling edit
      this.loadUserData();
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  saveProfile() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData: ProfileUpdateData = {
      first_name: this.editData.first_name,
      last_name: this.editData.last_name,
      email: this.editData.email,
      bio: this.editData.bio
    };

    // Add profile photo if selected
    if (this.selectedFile) {
      updateData.profile_photo = this.selectedFile;
    }

    this.authService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.user = response.user;
        this.isLoading = false;
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully!';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  getProfileCompletion(): number {
    if (!this.user) return 0;
    
    let completion = 0;
    const totalFields = 5; // name, email, bio, profile_photo, location
    
    if (this.user.first_name && this.user.last_name) completion += 20;
    if (this.user.email) completion += 20;
    if (this.user.bio) completion += 20;
    if (this.user.profile_photo) completion += 20;
    // Location is not implemented yet, so we'll give 20% for now
    completion += 20;
    
    return Math.min(completion, 100);
  }
}
