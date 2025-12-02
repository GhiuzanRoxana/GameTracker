import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  GameDetail,
  GameTrailer,
  GameScreenshot
} from '../../models/game.model';
import { GameService } from '../../services/game.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.css'
})
export class GameDetailComponent implements OnInit {
  game: GameDetail | null = null;
  trailers: GameTrailer[] = [];
  screenshots: GameScreenshot[] = [];

  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      this.errorMessage = 'Invalid game id.';
      this.loading = false;
      return;
    }

    this.loadGame(id);
    this.loadTrailers(id);
    this.loadScreenshots(id);
  }

  loadGame(id: number): void {
    this.loading = true;
    this.errorMessage = null;

    this.gameService.getGameDetails(id).subscribe({
      next: (data) => {
        this.game = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading game details:', error);
        this.errorMessage = 'Could not load game details.';
        this.loading = false;
      }
    });
  }

  loadTrailers(id: number): void {
    this.gameService.getGameTrailers(id).subscribe({
      next: (data) => {
        this.trailers = data.results;
      },
      error: (error) => {
        console.error('Error loading trailers:', error);
      }
    });
  }

  loadScreenshots(id: number): void {
    this.gameService.getGameScreenshots(id).subscribe({
      next: (data) => {
        this.screenshots = data.results;
      },
      error: (error) => {
        console.error('Error loading screenshots:', error);
      }
    });
  }

  get isFavorite(): boolean {
    return this.game ? this.favoritesService.isFavorite(this.game.id) : false;
  }

  toggleFavorite(): void {
    if (!this.game) {
      return;
    }

    if (this.isFavorite) {
      this.favoritesService.removeFavorite(this.game.id);
    } else {
      this.favoritesService.addFavorite(this.game);
    }
  }

  get mainTrailerUrl(): string | null {
    if (this.trailers.length === 0) {
      return null;
    }

    const first = this.trailers[0];
    return first.data.max || first.data['480'];
  }
}
