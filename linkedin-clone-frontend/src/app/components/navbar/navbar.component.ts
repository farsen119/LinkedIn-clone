import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn = false;
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAuthenticated$.subscribe((isAuth: boolean) => {
      this.isLoggedIn = isAuth;
      if (isAuth) {
        this.user = this.authService.getUser();
      } else {
        this.user = null;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
