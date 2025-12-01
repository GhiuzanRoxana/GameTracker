import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Game,
  GameDetail,
  GameResponse,
  GameTrailerResponse,
  GameScreenshotResponse
} from '../models/game.model';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'https://api.rawg.io/api';
  private apiKey = 'eeaa8bcd56514f5f9fdbb1919662aafd';

  constructor(private http: HttpClient) {}

getGames(
  page: number = 1,
  pageSize: number = 20,
  search?: string,
  platformId?: number,
  year?: number
) {
    let params = new HttpParams()
  .set('key', this.apiKey)
  .set('page', page)
  .set('page_size', pageSize);

if (search) {
  params = params.set('search', search);
}

if (platformId) {
  params = params.set('platforms', platformId);
}

if (year) {
  const from = `${year}-01-01`;
  const to = `${year}-12-31`;
  params = params.set('dates', `${from},${to}`);
}

  return this.http.get<GameResponse>(`${this.apiUrl}/games`, { params });

  }

  getGameDetails(id: number): Observable<GameDetail> {
    const params = new HttpParams().set('key', this.apiKey);
    return this.http.get<GameDetail>(`${this.apiUrl}/games/${id}`, { params });
  }

  searchGames(query: string, page: number = 1, pageSize: number = 20): Observable<GameResponse> {
  return this.getGames(page, pageSize, query);
  }

  getGameTrailers(id: number) {
  const params = new HttpParams().set('key', this.apiKey);

  return this.http.get<GameTrailerResponse>(
    `${this.apiUrl}/games/${id}/movies`,
    { params }
  );
}

getGameScreenshots(id: number) {
  const params = new HttpParams().set('key', this.apiKey);

  return this.http.get<GameScreenshotResponse>(
    `${this.apiUrl}/games/${id}/screenshots`,
    { params }
  );
}


}