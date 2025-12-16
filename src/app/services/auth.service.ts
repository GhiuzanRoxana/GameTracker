import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserAccounts } from '../models/user.mode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private USERS_DB = 'users_db';         
  private SESSION_KEY = 'logged_user';    

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadSession());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  private getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_DB) || '[]');
  }

  private saveAllUsers(users: User[]): void {
    localStorage.setItem(this.USERS_DB, JSON.stringify(users));
  }

  private loadSession(): User | null {
    const data = sessionStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  private saveSession(user: User): void {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user); 
  }

  private clearSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    this.currentUserSubject.next(null);
  }

  register(username: string, password: string): boolean {
    const users = this.getAllUsers();

    if (users.some(u => u.username === username)) {
      return false; 
    }

    const newUser: User = { username, password};
    users.push(newUser);
    this.saveAllUsers(users);
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.getAllUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) return false;

    this.saveSession(user);
    return true;
  }

  logout(): void {
    this.clearSession();
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  updateAccounts(accounts: UserAccounts): void {
  const user = this.getUser();
  if (!user) return;

  const updatedUser = { ...user, accounts };

  const users = JSON.parse(localStorage.getItem(this.USERS_DB) || '[]');
  const idx = users.findIndex((u: any) => u.username === user.username);

  if (idx !== -1) {
    users[idx] = updatedUser;
    localStorage.setItem(this.USERS_DB, JSON.stringify(users));
  }

  sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(updatedUser));
  
  this.currentUserSubject.next(updatedUser);
  }
}
