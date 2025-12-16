import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { GameCardComponent } from '../../components/game-card/game-card';
import { Game } from '../../models/game.model';
import { Review } from '../../models/review.model';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, GameCardComponent, RouterLink],
  templateUrl: './user-page.html',
  styleUrls: ['./user-page.css']
})
export class UserPageComponent implements OnInit {
  favorites: Game[] = [];
  user: any;
  userReviews: Review[] = [];

  constructor(
    private favService: FavoritesService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.favorites = this.favService.getFavorites();
  }
}
