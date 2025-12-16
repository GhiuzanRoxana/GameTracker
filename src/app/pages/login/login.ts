import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private favoritesService: FavoritesService, private router: Router) {}

  login(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Please enter username and password.';
      return;
    }

    const ok = this.auth.login(this.username, this.password);

    if (!ok) {
      this.error = 'Invalid username or password.';
      return;
    }

    this.favoritesService.reload();
    this.router.navigate(['/user']);
  }
}
