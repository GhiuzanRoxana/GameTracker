import { Injectable } from '@angular/core';
import { Review } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private KEY = 'game_reviews';

  getAll(): Review[] {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  }

  add(review: Review): void {
    const reviews = this.getAll();
    localStorage.setItem(this.KEY, JSON.stringify([...reviews, review]));
  }

  getByUser(username: string): Review[] {
    return this.getAll().filter(r => r.username === username);
  }

  getUserReviewForGame(username: string, gameTitle: string) {
    return this.getAll().find(
      r => r.username === username && r.gameTitle === gameTitle
    );  
  } 

  delete(id: number): void {
    const updated = this.getAll().filter(r => r.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(updated));
  }

}
