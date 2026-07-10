import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav
      class="navbar navbar-expand-lg"
      [class.navbar-dark]="isDark || isAuthPage"
      [class.navbar-light]="!isDark && !isAuthPage"
      [class.bg-primary]="!isAuthPage && !isDark"
      [style.background]="isAuthPage ? 'rgba(0,0,0,0.15)' : isDark ? '#16213e' : ''"
      [style.backdrop-filter]="isAuthPage ? 'blur(10px)' : 'none'"
      [style.border-bottom]="isAuthPage ? '1px solid rgba(255,255,255,0.1)' : 'none'"
    >
      <div class="container">
        <a class="navbar-brand" routerLink="/"><i class="fas fa-book-open me-2"></i>BookVault</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav">
          <ul class="navbar-nav me-auto" *ngIf="auth.isLoggedIn()">
            <li class="nav-item">
              <a class="nav-link" routerLink="/books" routerLinkActive="active">
                <i class="fas fa-book me-1"></i>Books
                <span class="badge bg-white text-primary ms-1">{{ bookCount }}</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/quotes" routerLinkActive="active">
                <i class="fas fa-quote-left me-1"></i>My Quotes
              </a>
            </li>
          </ul>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-outline-light btn-sm" (click)="toggleDark()">
              <i class="fas" [class.fa-moon]="!dark()" [class.fa-sun]="dark()"></i>
            </button>
            <a *ngIf="auth.isLoggedIn()" routerLink="/profile" class="btn btn-outline-light btn-sm">
              <i class="fas fa-user me-1"></i>{{ username }}
            </a>
            <button
              *ngIf="auth.isLoggedIn()"
              class="btn btn-outline-light btn-sm"
              (click)="auth.logout()"
            >
              <i class="fas fa-sign-out-alt me-1"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent implements OnInit {
  dark = signal(localStorage.getItem('darkMode') === 'true');
  bookCount = 0;
  isAuthPage = false;
  username = '';
  private api = 'https://hogwards-vault.onrender.com/api/Books';
  private authApi = 'https://hogwards-vault.onrender.com/api/Auth';

  get isDark(): boolean {
    return document.body.classList.contains('dark-mode');
  }

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.loadBookCount();
      this.loadUsername();
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAuthPage = event.url === '/login' || event.url === '/register';
        if (this.auth.isLoggedIn()) {
          this.loadBookCount();
          this.loadUsername();
        }
      }
    });
  }

  loadBookCount() {
    this.http.get<any[]>(this.api).subscribe((b) => (this.bookCount = b.length));
  }

  loadUsername() {
    this.http.get<any>(`${this.authApi}/profile`).subscribe({
      next: (data) => (this.username = data.username),
      error: () => (this.username = ''),
    });
  }

  toggleDark() {
    this.dark.update((v) => !v);
    document.body.classList.toggle('dark-mode', this.dark());
    localStorage.setItem('darkMode', String(this.dark()));
  }
}
