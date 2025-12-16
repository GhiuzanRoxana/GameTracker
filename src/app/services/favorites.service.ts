import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: Game[] = [];

  constructor(private auth: AuthService) {
    this.loadFavoritesForCurrentUser();
  }

  private get storageKey(): string | null {
    const user = this.auth.getUser();
    return user ? `gametracker_favorites_${user.username}` : `gametracker_favorites_guest`;
  }

  private loadFavoritesForCurrentUser(): void {
    const key = this.storageKey;
    if (!key) {
      this.favorites = [];
      return;
    }
    const data = localStorage.getItem(key);
    this.favorites = data ? JSON.parse(data) : [];
  }

  private saveFavorites(): void {
    const key = this.storageKey;
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(this.favorites));
  }

  mergeGuestFavoritesIntoUser(): void {
    const user = this.auth.getUser();
    if (!user) return;

    const guestKey = 'gametracker_favorites_guest';
    const userKey = `gametracker_favorites_${user.username}`;

    const guestFavs: Game[] = JSON.parse(localStorage.getItem(guestKey) || '[]');
    const userFavs: Game[] = JSON.parse(localStorage.getItem(userKey) || '[]');

    const merged = [...userFavs];

    guestFavs.forEach(g => {
      if (!merged.some(u => u.id === g.id)) {
        merged.push(g);
      }
    });

    localStorage.setItem(userKey, JSON.stringify(merged));
    localStorage.removeItem(guestKey);

    this.favorites = merged;
  }

  getFavorites(): Game[] {
    return this.favorites;
  }

  isFavorite(id: number): boolean {
    return this.favorites.some(g => g.id === id);
  }

  addFavorite(game: Game): void {
    if (this.isFavorite(game.id)) return;
    this.favorites.push(game);
    this.saveFavorites();
  }

  removeFavorite(id: number): void {
    this.favorites = this.favorites.filter(g => g.id !== id);
    this.saveFavorites();
  }

  reload(): void {
    this.mergeGuestFavoritesIntoUser();
  }

  clearInMemory(): void {
    this.favorites = [];
  }
}
