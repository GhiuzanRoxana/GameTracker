import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['../login/login.css'] // SAME STYLING
})
export class RegisterComponent {
  username = '';
  password = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private favorites: FavoritesService, private router: Router) {}

  register(): void {
    if (!this.username || !this.password) {
      this.error = 'Please complete all fields.';
      return;
    }

    const created = this.auth.register(this.username, this.password);

    if (!created) {
      this.error = 'Username already exists.';
      return;
    }

    this.success = 'Account created';

    this.auth.login(this.username, this.password);

    this.favorites.mergeGuestFavoritesIntoUser();
    this.router.navigate(['/user']);
  }
}
