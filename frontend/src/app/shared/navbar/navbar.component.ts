import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
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
  private api = 'https://hogwards-vault.onrender.com/api/Books';

  constructor(
    public auth: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.auth.isLoggedIn() && this.loadBookCount();
  }

  loadBookCount() {
    this.http.get<any[]>(this.api).subscribe((b) => (this.bookCount = b.length));
  }

  toggleDark() {
    this.dark.update((v) => !v);
    document.body.classList.toggle('dark-mode', this.dark());
    localStorage.setItem('darkMode', String(this.dark()));
  }
}
