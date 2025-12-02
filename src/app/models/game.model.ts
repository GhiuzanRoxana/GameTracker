export interface GamePlatformItem {
  platform: {
    id: number;
    name: string;
  };
}

export interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  metacritic?: number;
  genres?: { id: number; name: string }[];
  parent_platforms?: GamePlatformItem[];
  platforms?: GamePlatformItem[];
}

export interface GameDetail extends Game {
  description_raw: string;
  publishers?: { id: number; name: string }[];
  developers?: { id: number; name: string }[];
  website?: string;
  playtime?: number;
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
    '480': string;
    max: string;
  };
}

export interface GameTrailerResponse {
  count: number;
  results: GameTrailer[];
}

export interface GameScreenshot {
  id: number;
  image: string;
}

export interface GameScreenshotResponse {
  count: number;
  results: GameScreenshot[];
}
