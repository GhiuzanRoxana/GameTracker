export interface UserAccounts {
  xbox?: string;
  playstation?: string;
  steam?: string;
}

export interface User {
  username: string;
  password: string;
  accounts?: UserAccounts;
}

