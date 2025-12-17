import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReviewsService } from '../../services/reviews.service';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-review.html',
  styleUrls: ['../login/login.css']
})
export class AddReviewComponent {

  gameTitle = '';
  rating = 10;
  comment = '';

  constructor(
    private auth: AuthService,
    private reviews: ReviewsService,
    private router: Router
  ) {}

  checkRating() {
    if (this.rating > 10) {
      this.rating = 10;
    }
    if (this.rating < 1) {
      this.rating = 1;
    }
  }

  save(): void {
    const user = this.auth.getUser();
    if (!user) return;

    this.reviews.add({
      id: Date.now(),
      gameTitle: this.gameTitle,
      rating: this.rating,
      comment: this.comment,
      username: user.username,
      date: new Date().toISOString()
    });

    this.router.navigate(['/user']);
  }

  cancel(): void {
    this.router.navigate(['/user']);
  }
}
