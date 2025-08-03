import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, PostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
