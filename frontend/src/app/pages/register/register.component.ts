import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
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
              <input class="form-control" [(ngModel)]="username" placeholder="Choose username">
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input class="form-control" type="password" [(ngModel)]="password" placeholder="Choose password">
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
  `
})
export class RegisterComponent {
  username = ''; password = ''; error = '';
  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/books']),
      error: (e) => this.error = e.error || 'Registration failed.'
    });
  }
}