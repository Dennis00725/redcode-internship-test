import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  styles: [
    `
      .login-wrapper {
        min-height: calc(100vh - 56px);
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        margin-top: -1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        padding: 2rem 0;
      }

      .bg-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('/darkmode-loginpage.png');
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        animation: slowZoom 12s ease-in-out infinite alternate;
        z-index: 0;
      }

      @keyframes slowZoom {
        0% {
          transform: scale(1);
          filter: brightness(0.85);
        }
        50% {
          transform: scale(1.05);
          filter: brightness(0.95);
        }
        100% {
          transform: scale(1.1);
          filter: brightness(0.85);
        }
      }

      .flicker-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
          ellipse at 52% 78%,
          rgba(255, 180, 50, 0.18) 0%,
          transparent 60%
        );
        animation: flicker 3s ease-in-out infinite;
        z-index: 1;
        pointer-events: none;
      }

      @keyframes flicker {
        0% {
          opacity: 0.8;
        }
        20% {
          opacity: 1;
        }
        40% {
          opacity: 0.7;
        }
        60% {
          opacity: 1;
        }
        80% {
          opacity: 0.85;
        }
        100% {
          opacity: 0.8;
        }
      }

      .particle {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 220, 100, 0.7);
        animation: floatUp linear infinite;
        z-index: 2;
        pointer-events: none;
      }

      @keyframes floatUp {
        0% {
          transform: translateY(100vh);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 0.6;
        }
        100% {
          transform: translateY(-100px);
          opacity: 0;
        }
      }

      .glass-card {
        position: relative;
        z-index: 10;
        background: rgba(10, 10, 30, 0.12) !important;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 20px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
        animation: fadeInCard 1.2s ease forwards;
      }

      .glass-card-light {
        background: rgba(255, 255, 255, 0.75) !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
      }

      @keyframes fadeInCard {
        0% {
          opacity: 0;
          transform: translateY(30px);
        }
        100% {
          opacity: 1;
          transform: translateY(0px);
        }
      }

      .form-control-dark {
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        color: #ffffff !important;
        border-radius: 10px;
      }

      .form-control-dark::placeholder {
        color: rgba(255, 255, 255, 0.45);
      }

      .form-control-dark:focus {
        background: rgba(255, 255, 255, 0.2) !important;
        border-color: rgba(255, 200, 100, 0.6) !important;
        box-shadow: 0 0 0 0.2rem rgba(255, 180, 50, 0.25) !important;
        color: #ffffff !important;
      }

      .form-control-light {
        background: rgba(255, 255, 255, 0.9) !important;
        border: 1px solid rgba(0, 0, 0, 0.2) !important;
        color: #000000 !important;
        border-radius: 10px;
      }

      .form-control-light::placeholder {
        color: rgba(0, 0, 0, 0.4);
      }

      .form-control-light:focus {
        background: #ffffff !important;
        border-color: #0d6efd !important;
        box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
        color: #000000 !important;
      }

      .glass-btn-dark {
        background: linear-gradient(
          135deg,
          rgba(180, 120, 40, 0.6),
          rgba(120, 70, 20, 0.6)
        ) !important;
        border: 1px solid rgba(255, 200, 100, 0.5) !important;
        color: #fff5e0 !important;
        border-radius: 10px;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .glass-btn-dark:hover {
        background: linear-gradient(
          135deg,
          rgba(220, 160, 60, 0.8),
          rgba(160, 100, 30, 0.8)
        ) !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 150, 0, 0.4);
      }

      .glass-btn-light {
        background: #0d6efd !important;
        border: none !important;
        color: #ffffff !important;
        border-radius: 10px;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .glass-btn-light:hover {
        background: #0b5ed7 !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4);
      }
    `,
  ],
  template: `
    <div class="login-wrapper">
      <!-- Background only in dark mode -->
      <ng-container *ngIf="isDark">
        <div class="bg-image"></div>
        <div class="flicker-overlay"></div>
        <div
          class="particle"
          *ngFor="let p of particles"
          [style.left]="p.left"
          [style.width]="p.size"
          [style.height]="p.size"
          [style.animation-duration]="p.duration"
          [style.animation-delay]="p.delay"
        ></div>
      </ng-container>

      <!-- Login Card -->
      <div class="col-md-4 col-sm-8 col-11" style="position:relative; z-index:10">
        <div class="card glass-card p-2" [class.glass-card-light]="!isDark">
          <div class="card-body p-4">
            <h3
              class="card-title text-center mb-1"
              [style.color]="isDark ? '#f5deb3' : '#000000'"
              [style.text-shadow]="isDark ? '0 2px 8px rgba(255,150,0,0.5)' : 'none'"
              style="font-family: Georgia, serif;"
            >
              <i class="fas fa-book-open me-2"></i>BookVault
            </h3>
            <h5
              class="text-center mb-4 fw-light"
              [style.color]="isDark ? 'rgba(255,255,255,0.7)' : '#333333'"
            >
              Welcome Back
            </h5>
            <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
            <div class="mb-3">
              <label class="form-label fw-500" [style.color]="isDark ? '#e0d5c0' : '#000000'">
                Username
              </label>
              <input
                [class.form-control-dark]="isDark"
                [class.form-control-light]="!isDark"
                class="form-control"
                [class.is-invalid]="submitted && !username"
                [(ngModel)]="username"
                placeholder="Enter username"
              />
              <div class="invalid-feedback">Username is required.</div>
            </div>
            <div class="mb-3">
              <label class="form-label" [style.color]="isDark ? '#e0d5c0' : '#000000'">
                Password
              </label>
              <input
                [class.form-control-dark]="isDark"
                [class.form-control-light]="!isDark"
                class="form-control"
                type="password"
                [class.is-invalid]="submitted && !password"
                [(ngModel)]="password"
                placeholder="Enter password"
              />
              <div class="invalid-feedback">Password is required.</div>
            </div>
            <button
              class="btn w-100 mt-2"
              [class.glass-btn-dark]="isDark"
              [class.glass-btn-light]="!isDark"
              (click)="login()"
            >
              <i class="fas fa-sign-in-alt me-1"></i>Login
            </button>
            <p
              class="text-center mt-3 mb-0"
              [style.color]="isDark ? 'rgba(255,255,255,0.7)' : '#333333'"
            >
              No account?
              <a routerLink="/register" [style.color]="isDark ? '#ffd27d' : '#0d6efd'">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  submitted = false;
  particles: any[] = [];

  get isDark(): boolean {
    return document.body.classList.contains('dark-mode');
  }

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.generateParticles();
  }

  generateParticles() {
    this.particles = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      duration: `${Math.random() * 8 + 6}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }

  login() {
    this.submitted = true;
    if (!this.username || !this.password) return;

    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/books']),
      error: () => (this.error = 'Invalid username or password.'),
    });
  }
}
