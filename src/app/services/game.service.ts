import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game, GameDetail, GameResponse } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'https://api.rawg.io/api';
  private apiKey = 'eeaa8bcd56514f5f9fdbb1919662aafd';

  constructor(private http: HttpClient) {}

  getGames(page: number = 1, pageSize: number = 20, search?: string): Observable<GameResponse> {
    let params = new HttpParams()
      .set('key', this.apiKey)
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<GameResponse>(`${this.apiUrl}/games`, { params });
  }

  getGameDetails(id: number): Observable<GameDetail> {
    const params = new HttpParams().set('key', this.apiKey);
    return this.http.get<GameDetail>(`${this.apiUrl}/games/${id}`, { params });
  }

  searchGames(query: string): Observable<GameResponse> {
    return this.getGames(1, 20, query);
  }
}