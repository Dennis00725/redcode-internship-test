import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  styles: [
    `
      .strength-bar {
        height: 6px;
        border-radius: 3px;
        transition: all 0.3s ease;
      }
      .strength-weak {
        background-color: #dc3545;
        width: 33%;
      }
      .strength-medium {
        background-color: #ffc107;
        width: 66%;
      }
      .strength-strong {
        background-color: #198754;
        width: 100%;
      }
      .strength-none {
        background-color: #e9ecef;
        width: 100%;
      }
    `,
  ],
  template: `
    <div class="row justify-content-center mt-5">
      <div class="col-md-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h3 class="card-title text-center mb-4">
              <i class="fas fa-user-plus me-2 text-primary"></i>Register
            </h3>
            <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input
                class="form-control"
                [class.is-invalid]="submitted && !username"
                [(ngModel)]="username"
                placeholder="Choose username"
              />
              <div class="invalid-feedback">Username is required.</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                class="form-control"
                type="password"
                [class.is-invalid]="submitted && password.length < 6"
                [(ngModel)]="password"
                (ngModelChange)="checkStrength()"
                placeholder="Choose password (min 6 characters)"
              />
              <div class="invalid-feedback">Password must be at least 6 characters.</div>

              <!-- Strength Bar -->
              <div class="mt-2" *ngIf="password.length > 0">
                <div
                  class="strength-bar"
                  [class.strength-none]="strength === 0"
                  [class.strength-weak]="strength === 1"
                  [class.strength-medium]="strength === 2"
                  [class.strength-strong]="strength === 3"
                ></div>
                <small
                  class="mt-1 d-block"
                  [class.text-danger]="strength === 1"
                  [class.text-warning]="strength === 2"
                  [class.text-success]="strength === 3"
                >
                  <span *ngIf="strength === 1">🔴 Weak — add numbers or symbols</span>
                  <span *ngIf="strength === 2">🟡 Medium — getting stronger!</span>
                  <span *ngIf="strength === 3">🟢 Strong password!</span>
                </small>
              </div>
            </div>
            <button class="btn btn-success w-100" (click)="register()">
              <i class="fas fa-user-plus me-1"></i>Create Account
            </button>
            <p class="text-center mt-3">
              Already have an account? <a routerLink="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  username = '';
  password = '';
  error = '';
  submitted = false;
  strength = 0;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  checkStrength() {
    const p = this.password;
    if (p.length === 0) {
      this.strength = 0;
      return;
    }

    let score = 0;

    // Length check
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;

    // Has numbers
    if (/\d/.test(p)) score++;

    // Has special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(p)) score++;

    // Has uppercase
    if (/[A-Z]/.test(p)) score++;

    if (score <= 2)
      this.strength = 1; // Weak
    else if (score <= 3)
      this.strength = 2; // Medium
    else this.strength = 3; // Strong
  }

  register() {
    this.submitted = true;
    if (!this.username || this.password.length < 6) return;

    this.auth.register(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/books']),
      error: (e) => (this.error = e.error || 'Registration failed.'),
    });
  }
}
