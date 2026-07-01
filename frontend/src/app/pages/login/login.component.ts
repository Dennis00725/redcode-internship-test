import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `
    <div class="row justify-content-center mt-5">
      <div class="col-md-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h3 class="card-title text-center mb-4">
              <i class="fas fa-lock me-2 text-primary"></i>Login
            </h3>
            <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input 
                class="form-control" 
                [class.is-invalid]="submitted && !username"
                [(ngModel)]="username" 
                placeholder="Enter username">
              <div class="invalid-feedback">Username is required.</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input 
                class="form-control" 
                type="password" 
                [class.is-invalid]="submitted && !password"
                [(ngModel)]="password" 
                placeholder="Enter password">
              <div class="invalid-feedback">Password is required.</div>
            </div>
            <button class="btn btn-primary w-100" (click)="login()">
              <i class="fas fa-sign-in-alt me-1"></i>Login
            </button>
            <p class="text-center mt-3">
              No account? <a routerLink="/register">Register</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = ''; 
  password = ''; 
  error = '';
  submitted = false;
  
  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.submitted = true;
    if (!this.username || !this.password) return;
    
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/books']),
      error: () => this.error = 'Invalid username or password.'
    });
  }
}