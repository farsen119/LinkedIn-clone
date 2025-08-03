import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData = {
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.post(`${environment.apiUrl}/auth/register/`, this.registerData)
      .subscribe({
        next: (response: any) => {
          console.log('Registration successful:', response);
          this.isLoading = false;
          
          // Store token and user data
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Redirect to home page
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.isLoading = false;
          
          if (error.error) {
            this.errorMessage = Object.values(error.error).join(', ');
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      });
  }
}
