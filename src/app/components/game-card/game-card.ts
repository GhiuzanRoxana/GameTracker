import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Game } from '../../models/game.model';
import { FavoritesService } from '../../services/favorites.service';


@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
    templateUrl: './game-card.html',
    styleUrl: './game-card.css'
})
export class GameCardComponent implements OnChanges {
  @Input() game!: Game;
  isFavorite = false;

  constructor(private favoritesService: FavoritesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['game'] && this.game) {
      this.isFavorite = this.favoritesService.isFavorite(this.game.id);
    }
  }

  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.game) {
      return;
    }

    if (this.isFavorite) {
      this.favoritesService.removeFavorite(this.game.id);
      this.isFavorite = false;
    } else {
      this.favoritesService.addFavorite(this.game);
      this.isFavorite = true;
    }
  }
}
