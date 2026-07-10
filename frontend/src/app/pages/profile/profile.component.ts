import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `
      .profile-wrapper {
        min-height: calc(100vh - 56px);
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        margin-top: -1.5rem;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 0;
      }

      .bg-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        animation: slowZoom 12s ease-in-out infinite alternate;
        z-index: 0;
      }

      .bg-light {
        background-image: url('/lightmode-addbookpage.png');
      }
      .bg-dark {
        background-image: url('/darkmode-homepage.png');
      }

      @keyframes slowZoom {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(1.05);
        }
      }

      .flicker-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        animation: flicker 3s ease-in-out infinite;
        z-index: 1;
        pointer-events: none;
      }

      .flicker-dark {
        background: radial-gradient(
          ellipse at 30% 80%,
          rgba(255, 150, 30, 0.1) 0%,
          transparent 50%
        );
      }
      .flicker-light {
        background: radial-gradient(
          ellipse at 50% 90%,
          rgba(255, 220, 100, 0.08) 0%,
          transparent 50%
        );
      }

      @keyframes flicker {
        0% {
          opacity: 0.8;
        }
        25% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
        75% {
          opacity: 1;
        }
        100% {
          opacity: 0.8;
        }
      }

      .particle {
        position: absolute;
        border-radius: 50%;
        animation: floatUp linear infinite;
        z-index: 2;
        pointer-events: none;
      }

      .particle-dark {
        background: rgba(255, 200, 80, 0.5);
      }
      .particle-light {
        background: rgba(255, 230, 150, 0.6);
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
          opacity: 0.5;
        }
        100% {
          transform: translateY(-100px);
          opacity: 0;
        }
      }

      .glass-card {
        position: relative;
        z-index: 10;
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-radius: 20px !important;
        animation: fadeIn 0.8s ease forwards;
      }

      .glass-card-light {
        background: rgba(255, 245, 210, 0.75) !important;
        border: 1px solid rgba(180, 130, 40, 0.3) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        color: #3d2000 !important;
      }

      .glass-card-dark {
        background: rgba(15, 10, 5, 0.65) !important;
        border: 1px solid rgba(255, 180, 50, 0.2) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
        color: #ffe8a0 !important;
      }

      @keyframes fadeIn {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .avatar-circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin: 0 auto 1rem;
      }

      .avatar-light {
        background: rgba(180, 120, 40, 0.3);
        color: #5c3d0a;
      }
      .avatar-dark {
        background: rgba(255, 180, 50, 0.2);
        color: #ffc850;
      }

      .label-light {
        color: #5c3d0a;
        font-family: Georgia, serif;
      }
      .label-dark {
        color: #ffc850;
        font-family: Georgia, serif;
      }

      .scroll-input-light {
        background: rgba(255, 250, 220, 0.85) !important;
        border: 1px solid rgba(180, 130, 40, 0.5) !important;
        color: #3d2000 !important;
      }

      .scroll-input-dark {
        background: rgba(30, 18, 3, 0.7) !important;
        border: 1px solid rgba(180, 120, 30, 0.4) !important;
        color: #ffe8a0 !important;
      }

      .scroll-input-light::placeholder {
        color: rgba(100, 60, 0, 0.5);
      }
      .scroll-input-dark::placeholder {
        color: rgba(200, 150, 50, 0.4);
      }

      .scroll-btn-light {
        background: rgba(160, 100, 20, 0.75) !important;
        border: 1px solid rgba(130, 80, 10, 0.8) !important;
        color: #fff8e7 !important;
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .scroll-btn-light:hover {
        background: rgba(140, 85, 10, 0.9) !important;
        transform: translateY(-1px);
      }

      .scroll-btn-dark {
        background: rgba(180, 100, 10, 0.6) !important;
        border: 1px solid rgba(220, 150, 30, 0.5) !important;
        color: #ffe8a0 !important;
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .scroll-btn-dark:hover {
        background: rgba(200, 120, 15, 0.8) !important;
        transform: translateY(-1px);
      }

      .divider-light {
        border-color: rgba(180, 130, 40, 0.3);
      }
      .divider-dark {
        border-color: rgba(255, 180, 50, 0.2);
      }
    `,
  ],
  template: `
    <div class="profile-wrapper">
      <!-- Background -->
      <div class="bg-image" [class.bg-light]="!isDark" [class.bg-dark]="isDark"></div>

      <!-- Flicker -->
      <div
        class="flicker-overlay"
        [class.flicker-light]="!isDark"
        [class.flicker-dark]="isDark"
      ></div>

      <!-- Particles -->
      <div
        class="particle"
        [class.particle-light]="!isDark"
        [class.particle-dark]="isDark"
        *ngFor="let p of particles"
        [style.left]="p.left"
        [style.width]="p.size"
        [style.height]="p.size"
        [style.animation-duration]="p.duration"
        [style.animation-delay]="p.delay"
      ></div>

      <!-- Profile Card -->
      <div class="col-md-5 col-sm-8 col-11" style="position:relative; z-index:10">
        <div
          class="card glass-card p-2"
          [class.glass-card-light]="!isDark"
          [class.glass-card-dark]="isDark"
        >
          <div class="card-body p-4">
            <!-- Avatar -->
            <div class="avatar-circle" [class.avatar-light]="!isDark" [class.avatar-dark]="isDark">
              <i class="fas fa-user-circle"></i>
            </div>

            <!-- Username -->
            <h3
              class="text-center mb-1"
              style="font-family: Georgia, serif;"
              [style.color]="isDark ? '#ffd27d' : '#5c3d0a'"
            >
              {{ username }}
            </h3>
            <p
              class="text-center mb-3"
              [style.color]="isDark ? 'rgba(255,200,100,0.6)' : 'rgba(100,60,0,0.6)'"
              style="font-size: 0.85rem;"
            >
              <i class="fas fa-shield-alt me-1"></i>BookVault Member
            </p>

            <hr [class.divider-light]="!isDark" [class.divider-dark]="isDark" />

            <!-- Change Password -->
            <h5
              class="mb-3"
              style="font-family: Georgia, serif;"
              [style.color]="isDark ? '#ffc850' : '#5c3d0a'"
            >
              <i class="fas fa-key me-2"></i>Change Password
            </h5>

            <div *ngIf="error" class="alert alert-danger py-2">{{ error }}</div>

            <div class="mb-3">
              <label class="form-label" [class.label-light]="!isDark" [class.label-dark]="isDark">
                Current Password
              </label>
              <input
                class="form-control"
                [class.scroll-input-light]="!isDark"
                [class.scroll-input-dark]="isDark"
                type="password"
                [(ngModel)]="currentPassword"
                [class.is-invalid]="submitted && !currentPassword"
                placeholder="Enter current password"
              />
              <div class="invalid-feedback">Current password is required.</div>
            </div>

            <div class="mb-3">
              <label class="form-label" [class.label-light]="!isDark" [class.label-dark]="isDark">
                New Password
              </label>
              <input
                class="form-control"
                [class.scroll-input-light]="!isDark"
                [class.scroll-input-dark]="isDark"
                type="password"
                [(ngModel)]="newPassword"
                [class.is-invalid]="submitted && newPassword.length < 6"
                placeholder="Enter new password (min 6 characters)"
              />
              <div class="invalid-feedback">New password must be at least 6 characters.</div>
            </div>

            <div class="mb-3">
              <label class="form-label" [class.label-light]="!isDark" [class.label-dark]="isDark">
                Confirm New Password
              </label>
              <input
                class="form-control"
                [class.scroll-input-light]="!isDark"
                [class.scroll-input-dark]="isDark"
                type="password"
                [(ngModel)]="confirmPassword"
                [class.is-invalid]="submitted && newPassword !== confirmPassword"
                placeholder="Confirm new password"
              />
              <div class="invalid-feedback">Passwords do not match.</div>
            </div>

            <button
              class="btn w-100"
              [class.scroll-btn-light]="!isDark"
              [class.scroll-btn-dark]="isDark"
              (click)="changePassword()"
              [disabled]="loading"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
              <i *ngIf="!loading" class="fas fa-save me-1"></i>
              {{ loading ? 'Saving...' : 'Update Password' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private api = 'https://hogwards-vault.onrender.com/api/Auth';
  username = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  submitted = false;
  loading = false;
  particles: any[] = [];

  get isDark(): boolean {
    return document.body.classList.contains('dark-mode');
  }

  constructor(
    private http: HttpClient,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.generateParticles();
  }

  generateParticles() {
    this.particles = Array.from({ length: 15 }, () => ({
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 2}px`,
      duration: `${Math.random() * 8 + 6}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }

  loadProfile() {
    this.http.get<any>(`${this.api}/profile`).subscribe({
      next: (data) => (this.username = data.username),
      error: () => (this.username = 'User'),
    });
  }

  changePassword() {
    this.submitted = true;
    this.error = '';

    if (
      !this.currentPassword ||
      this.newPassword.length < 6 ||
      this.newPassword !== this.confirmPassword
    )
      return;

    this.loading = true;
    this.http
      .post(`${this.api}/change-password`, {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.submitted = false;
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.toast.show('Password changed successfully!');
        },
        error: (e) => {
          this.loading = false;
          this.error = e.error || 'Failed to change password.';
        },
      });
  }
}
