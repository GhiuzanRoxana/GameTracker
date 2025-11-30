export interface Platform {
  id: number;
  name: string;
  slug: string;
}

export interface ParentPlatform {
  platform: Platform;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  ratings_count: number;
  released: string;
  metacritic?: number;
  genres?: Genre[];
  platforms?: { platform: { id: number; name: string; } }[];
  parent_platforms?: ParentPlatform[];
}

export interface GameDetail extends Game {
  description_raw: string;
  website?: string;
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

export interface GameTrailer {
  id: number;
  name: string;
  preview: string;
  data: {
    480: string;
    max: string;
  };
}

export interface GameTrailerResponse {
  results: GameTrailer[];
}

export interface GameScreenshot {
  id: number;
  image: string;
}

export interface GameScreenshotResponse {
  results: GameScreenshot[];
}
