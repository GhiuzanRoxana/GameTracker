import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, GameCardComponent],
    templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent implements OnInit {
  games: Game[] = [];
  loading = true;
  currentPage = 1;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.loading = true;
    this.gameService.getGames(this.currentPage, 20).subscribe({
      next: (response) => {
        this.games = response.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading games:', error);
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    this.currentPage++;
    this.gameService.getGames(this.currentPage, 20).subscribe({
      next: (response) => {
        this.games = [...this.games, ...response.results];
      },
      error: (error) => {
        console.error('Error loading more games:', error);
      }
    });
  }
}