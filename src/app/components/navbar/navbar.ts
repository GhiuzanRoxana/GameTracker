import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class Navbar {
  searchQuery: string = '';

  constructor(public auth: AuthService, private favoritesService: FavoritesService, private router: Router) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
    }
  }
  
  logout(): void {
    this.auth.logout();
    this.favoritesService.clearInMemory();
    this.router.navigate(['/']);
  }
}