import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'gametracker_favorites';
  private favorites: Game[] = this.loadFavoritesFromStorage();

  private loadFavoritesFromStorage(): Game[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return [];
      }
      return JSON.parse(data) as Game[];
    } catch (error) {
      console.error('Failed to parse favorites from localStorage', error);
      return [];
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage', error);
    }
  }

  getFavorites(): Game[] {
    return this.favorites;
  }

  isFavorite(id: number): boolean {
    return this.favorites.some((g) => g.id === id);
  }

  addFavorite(game: Game): void {
    if (this.isFavorite(game.id)) {
      return;
    }

    this.favorites = [...this.favorites, game];
    this.saveFavorites();
  }

  removeFavorite(id: number): void {
    this.favorites = this.favorites.filter((g) => g.id !== id);
    this.saveFavorites();
  }
}
