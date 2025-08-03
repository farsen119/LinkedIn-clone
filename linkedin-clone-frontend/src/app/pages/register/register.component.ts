import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    profile_photo: undefined as File | undefined
  };

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showSuccessPopup = false;

  constructor(private authService: AuthService, private router: Router) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.registerData.profile_photo = file;
      
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
    this.registerData.profile_photo = undefined;
  }

  register() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.showSuccessPopup = false;

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Show success popup
        this.successMessage = `Welcome ${response.user.first_name} ${response.user.last_name}! Your account has been created successfully. You can now sign in with your credentials.`;
        this.showSuccessPopup = true;
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.error) {
          this.errorMessage = Object.values(error.error).join(', ');
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
    this.router.navigate(['/login']);
  }
}
