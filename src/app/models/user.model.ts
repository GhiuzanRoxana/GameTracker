export interface UserAccounts {
  xbox?: string;
  playstation?: string;
  steam?: string;
}

export interface Review {
  id: number;
  gameTitle: string;
  rating: number;
  comment: string;
  username: string;
  date: string;
}


export interface User {
  username: string;
  password: string;
  accounts?: UserAccounts;
  profileImage?: string;
}

