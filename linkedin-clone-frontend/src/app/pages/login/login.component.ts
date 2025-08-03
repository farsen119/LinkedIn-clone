import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        
        // Redirect to home page
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading = false;
        
        if (error.error) {
          this.errorMessage = Object.values(error.error).join(', ');
        } else {
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      }
    });
  }
}
