import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { ReviewsService } from '../../services/reviews.service';
import { GameCardComponent } from '../../components/game-card/game-card';
import { Game } from '../../models/game.model';
import { Review } from '../../models/user.model';
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
  userReviews: Review[] = [];
  user: any;

  constructor(
    private favService: FavoritesService,
    private auth: AuthService,
    private reviews: ReviewsService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.favorites = this.favService.getFavorites();
    if (this.user) {
      this.userReviews = this.reviews.getByUser(this.user.username);
    }
  }

  deleteReview(id: number): void {
    this.reviews.delete(id);
    this.userReviews = this.reviews.getByUser(this.user.username);
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.auth.updateProfileImage(base64);
      this.user = this.auth.getUser(); // refresh local
    };

    reader.readAsDataURL(file);
  }

}
