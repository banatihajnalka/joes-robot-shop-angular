import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { IUser, IUserCredentials } from './user.model';

export interface IAuthResponse {
  user: IUser;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly TOKEN_KEY = 'auth_token';
  private user: BehaviorSubject<IUser | null>;

  constructor(private http: HttpClient) {
    this.user = new BehaviorSubject<IUser | null>(null);
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = this.getStoredToken();
    if (token) {
      // Decode token to get user info (basic validation)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Date.now() / 1000) {
          this.user.next({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email
          });
        } else {
          // Token expired, remove it
          this.clearStoredToken();
        }
      } catch {
        // Invalid token, remove it
        this.clearStoredToken();
      }
    }
  }

  getUser(): Observable<IUser | null> {
    return this.user;
  }

  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setStoredToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private clearStoredToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  signIn(credentials: IUserCredentials): Observable<IUser> {
    return this.http
      .post<IAuthResponse>('/api/sign-in', credentials)
      .pipe(
        tap((response: IAuthResponse) => {
          this.setStoredToken(response.token);
          this.user.next(response.user);
        }),
        map((response: IAuthResponse) => response.user)
      );
  }

  signOut(): void {
    this.clearStoredToken();
    this.user.next(null);
  }

  isAuthenticated(): boolean {
    return this.getStoredToken() !== null && this.user.value !== null;
  }
}
