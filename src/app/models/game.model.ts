export interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres?: { id: number; name: string; }[];
  platforms?: { platform: { id: number; name: string; } }[];
}

export interface GameDetail extends Game {
  description_raw: string;
  metacritic: number;
  publishers?: { id: number; name: string; }[];
  developers?: { id: number; name: string; }[];
}

export interface GameResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}