import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, GameCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredGames: Game[] = [];
  loading = true;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadFeaturedGames();
  }

  loadFeaturedGames(): void {
    this.gameService.getGames(1, 6).subscribe({
      next: (response) => {
        this.featuredGames = response.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading games:', error);
        this.loading = false;
      }
    });
  }
}