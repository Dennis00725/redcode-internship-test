import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://hogwards-vault.onrender.com/api/Auth';
  isLoggedIn = signal(!!localStorage.getItem('token'));

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  register(username: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.api}/register`, { username, password })
      .pipe(tap((r) => this.saveToken(r.token)));
  }

  login(username: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.api}/login`, { username, password })
      .pipe(tap((r) => this.saveToken(r.token)));
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  private saveToken(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn.set(true);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
