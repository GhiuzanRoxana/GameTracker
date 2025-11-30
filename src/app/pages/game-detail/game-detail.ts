import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';
import {
  GameDetail,
  GameTrailer,
  GameScreenshot
} from '../../models/game.model';

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
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      this.error = 'Invalid game id.';
      this.isLoading = false;
      return;
    }

    this.loadGame(id);
  }

  private loadGame(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.gameService.getGameDetails(id).subscribe({
      next: (game) => {
        this.game = game;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load game details.';
        this.isLoading = false;
      }
    });

    this.gameService.getGameTrailers(id).subscribe({
      next: (response) => {
        this.trailers = response.results || [];
      },
      error: () => {
      }
    });

    this.gameService.getGameScreenshots(id).subscribe({
      next: (response) => {
        this.screenshots = response.results || [];
      },
      error: () => {
      }
    });
  }

  get mainTrailerUrl(): string | null {
    if (!this.trailers.length) {
      return null;
    }

    const trailer = this.trailers[0];
    if (trailer.data && trailer.data.max) {
      return trailer.data.max;
    }
    if (trailer.data && trailer.data['480']) {
      return trailer.data['480'];
    }
    return null;
  }
}
