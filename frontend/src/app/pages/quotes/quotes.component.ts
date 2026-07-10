import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/toast.service';

interface Quote {
  id?: number;
  text: string;
  author: string;
}

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `
      .quotes-wrapper {
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
        background-image: url('/lightmode-myquotes.png');
      }
      .bg-dark {
        background-image: url('/darkmode-myquotes.png');
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
          ellipse at 50% 80%,
          rgba(255, 150, 30, 0.12) 0%,
          transparent 60%
        );
      }
      .flicker-light {
        background: radial-gradient(
          ellipse at 50% 80%,
          rgba(255, 220, 100, 0.1) 0%,
          transparent 60%
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
        background: rgba(255, 200, 80, 0.6);
      }
      .particle-light {
        background: rgba(255, 230, 150, 0.7);
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

      /* Scroll content area */
      .scroll-content {
        position: relative;
        z-index: 10;
        width: 48%;
        min-height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 3rem 3.5rem;
        margin-top: 1rem;
      }

      .scroll-title {
        font-family: Georgia, serif;
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .scroll-title-light {
        color: #5c3d0a;
        text-shadow: 1px 1px 3px rgba(180, 120, 0, 0.3);
      }
      .scroll-title-dark {
        color: #3d2800;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
      }

      .quote-item {
        width: 100%;
        padding: 0.6rem 0.8rem;
        margin-bottom: 0.5rem;
        border-radius: 8px;
        font-family: Georgia, serif;
        font-style: italic;
      }

      .quote-item-light {
        background: rgba(255, 240, 180, 0.4);
        border-left: 3px solid rgba(180, 120, 0, 0.5);
        color: #4a2e00;
      }

      .quote-item-dark {
        background: rgba(100, 60, 0, 0.3);
        border-left: 3px solid rgba(255, 180, 50, 0.5);
        color: #2d1a00;
      }

      .quote-author {
        font-size: 0.8rem;
        text-align: right;
        font-style: normal;
        font-weight: bold;
      }

      .quote-author-light {
        color: #7a5000;
      }
      .quote-author-dark {
        color: #5a3a00;
      }

      .scroll-btn-light {
        background: rgba(180, 120, 40, 0.7) !important;
        border: 1px solid rgba(140, 90, 20, 0.8) !important;
        color: #fff8e7 !important;
        font-family: Georgia, serif;
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .scroll-btn-light:hover {
        background: rgba(160, 100, 20, 0.9) !important;
        transform: translateY(-1px);
      }

      .scroll-btn-dark {
        background: rgba(120, 70, 10, 0.7) !important;
        border: 1px solid rgba(100, 60, 0, 0.8) !important;
        color: #ffe8a0 !important;
        font-family: Georgia, serif;
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .scroll-btn-dark:hover {
        background: rgba(100, 55, 5, 0.9) !important;
        transform: translateY(-1px);
      }

      .scroll-form {
        width: 100%;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
      }

      .scroll-form-light {
        background: rgba(255, 240, 180, 0.5);
        border: 1px solid rgba(180, 130, 40, 0.4);
      }

      .scroll-form-dark {
        background: rgba(80, 45, 5, 0.4);
        border: 1px solid rgba(150, 100, 20, 0.4);
      }

      .scroll-input-light {
        background: rgba(255, 250, 220, 0.8) !important;
        border: 1px solid rgba(180, 130, 40, 0.5) !important;
        color: #3d2000 !important;
        font-family: Georgia, serif;
      }

      .scroll-input-dark {
        background: rgba(60, 35, 5, 0.6) !important;
        border: 1px solid rgba(150, 100, 20, 0.5) !important;
        color: #ffe8a0 !important;
        font-family: Georgia, serif;
      }

      .scroll-input-light::placeholder {
        color: rgba(100, 60, 0, 0.5);
      }
      .scroll-input-dark::placeholder {
        color: rgba(200, 150, 50, 0.5);
      }

      .scroll-label-light {
        color: #5c3d0a;
        font-family: Georgia, serif;
      }
      .scroll-label-dark {
        color: #c8900a;
        font-family: Georgia, serif;
      }

      @media (max-width: 768px) {
        .scroll-content {
          width: 85%;
          padding: 2rem 1.5rem;
        }
      }
    `,
  ],
  template: `
    <div class="quotes-wrapper">
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

      <!-- Scroll Content -->
      <div class="scroll-content">
        <!-- Title -->
        <div
          class="scroll-title"
          [class.scroll-title-light]="!isDark"
          [class.scroll-title-dark]="isDark"
        >
          <i class="fas fa-feather me-2"></i>My Quotes
        </div>

        <!-- Add Quote Button -->
        <button
          class="btn mb-3"
          [class.scroll-btn-light]="!isDark"
          [class.scroll-btn-dark]="isDark"
          (click)="openForm()"
        >
          <i class="fas fa-plus me-1"></i>Add Quote
        </button>

        <!-- Form -->
        <div
          class="scroll-form w-100"
          *ngIf="showForm"
          [class.scroll-form-light]="!isDark"
          [class.scroll-form-dark]="isDark"
        >
          <div class="mb-2">
            <label
              class="form-label"
              [class.scroll-label-light]="!isDark"
              [class.scroll-label-dark]="isDark"
              >Quote</label
            >
            <textarea
              class="form-control"
              [class.scroll-input-light]="!isDark"
              [class.scroll-input-dark]="isDark"
              [class.is-invalid]="submitted && !form.text"
              [(ngModel)]="form.text"
              rows="2"
              placeholder="Enter quote text"
            ></textarea>
            <div class="invalid-feedback">Quote text is required.</div>
          </div>
          <div class="mb-2">
            <label
              class="form-label"
              [class.scroll-label-light]="!isDark"
              [class.scroll-label-dark]="isDark"
              >Author</label
            >
            <input
              class="form-control"
              [class.scroll-input-light]="!isDark"
              [class.scroll-input-dark]="isDark"
              [class.is-invalid]="submitted && !form.author"
              [(ngModel)]="form.author"
              placeholder="Who said this?"
            />
            <div class="invalid-feedback">Author is required.</div>
          </div>
          <div class="d-flex gap-2">
            <button
              class="btn btn-sm"
              [class.scroll-btn-light]="!isDark"
              [class.scroll-btn-dark]="isDark"
              (click)="save()"
              [disabled]="loading"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
              <i *ngIf="!loading" class="fas fa-save me-1"></i>
              {{ loading ? 'Saving...' : editing ? 'Update' : 'Save' }}
            </button>
            <button class="btn btn-sm btn-secondary" (click)="cancelForm()">Cancel</button>
          </div>
        </div>

        <!-- Quotes List -->
        <div class="w-100">
          <div
            class="quote-item"
            [class.quote-item-light]="!isDark"
            [class.quote-item-dark]="isDark"
            *ngFor="let q of quotes"
          >
            <p class="mb-1">
              <i class="fas fa-quote-left me-1" style="font-size:0.7rem"></i>
              {{ q.text }}
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <span
                class="quote-author"
                [class.quote-author-light]="!isDark"
                [class.quote-author-dark]="isDark"
              >
                — {{ q.author }}
              </span>
              <div class="d-flex gap-1">
                <button
                  class="btn btn-sm py-0 px-1"
                  style="font-size:0.75rem"
                  [class.scroll-btn-light]="!isDark"
                  [class.scroll-btn-dark]="isDark"
                  (click)="edit(q)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-sm py-0 px-1"
                  style="font-size:0.75rem; background:rgba(180,40,40,0.6) !important; color:white !important; border:none"
                  (click)="delete(q.id!)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <div
            *ngIf="quotes.length === 0"
            class="text-center py-3"
            [style.color]="isDark ? '#8B6914' : '#6B4C0A'"
            style="font-family: Georgia, serif; font-style: italic;"
          >
            <i class="fas fa-feather fa-2x d-block mb-2"></i>
            No quotes yet. Add your favorites!
          </div>
        </div>
      </div>
    </div>
  `,
})
export class QuotesComponent implements OnInit {
  private api = 'https://hogwards-vault.onrender.com/api/Quotes';
  quotes: Quote[] = [];
  showForm = false;
  editing = false;
  submitted = false;
  loading = false;
  form: Quote = { text: '', author: '' };
  editId?: number;
  particles: any[] = [];

  get isDark(): boolean {
    return document.body.classList.contains('dark-mode');
  }

  constructor(
    private http: HttpClient,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.load();
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

  load() {
    this.http.get<Quote[]>(this.api).subscribe((q) => (this.quotes = q));
  }

  openForm() {
    this.form = { text: '', author: '' };
    this.submitted = false;
    this.editing = false;
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.submitted = false;
  }

  edit(q: Quote) {
    this.form = { ...q };
    this.editId = q.id;
    this.submitted = false;
    this.editing = true;
    this.showForm = true;
  }

  save() {
    this.submitted = true;
    if (!this.form.text || !this.form.author) return;
    this.loading = true;

    if (this.editing) {
      this.http.put(`${this.api}/${this.editId}`, this.form).subscribe(() => {
        this.load();
        this.showForm = false;
        this.submitted = false;
        this.loading = false;
        this.toast.show('Quote updated successfully!');
      });
    } else {
      this.http.post(this.api, this.form).subscribe(() => {
        this.load();
        this.showForm = false;
        this.submitted = false;
        this.loading = false;
        this.toast.show('Quote added successfully!');
      });
    }
  }

  delete(id: number) {
    if (confirm('Delete this quote?'))
      this.http.delete(`${this.api}/${id}`).subscribe(() => {
        this.load();
        this.toast.show('Quote deleted!', 'danger');
      });
  }
}
