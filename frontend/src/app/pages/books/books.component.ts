import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/toast.service';

interface Book {
  id?: number;
  title: string;
  author: string;
  publicationDate: string;
  genre: string;
  readingStatus: string;
  rating: number;
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `
      .books-wrapper {
        min-height: calc(100vh - 56px);
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        margin-top: -1.5rem;
        position: relative;
        overflow: hidden;
        padding: 2rem 1rem;
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
          filter: brightness(0.9);
        }
        100% {
          transform: scale(1.05);
          filter: brightness(0.95);
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

      .content-area {
        position: relative;
        z-index: 10;
        padding: 0 1rem;
      }

      .glass-card {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: 16px !important;
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

      .page-title-light {
        color: #5c3d0a;
        font-family: Georgia, serif;
        text-shadow: 1px 1px 3px rgba(255, 220, 100, 0.5);
      }
      .page-title-dark {
        color: #ffd27d;
        font-family: Georgia, serif;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
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

      .table-light-theme {
        color: #3d2000 !important;
      }
      .table-dark-theme {
        color: #ffe8a0 !important;
      }

      .label-light {
        color: #5c3d0a;
        font-family: Georgia, serif;
      }
      .label-dark {
        color: #ffc850;
        font-family: Georgia, serif;
      }

      .star {
        cursor: pointer;
        font-size: 1.1rem;
        transition: transform 0.1s;
      }
      .star:hover {
        transform: scale(1.2);
      }
      .star-filled {
        color: #ffc107;
      }
      .star-empty {
        color: #aaaaaa;
      }
    `,
  ],
  template: `
    <div class="books-wrapper">
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

      <!-- Content -->
      <div class="content-area">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 [class.page-title-light]="!isDark" [class.page-title-dark]="isDark">
            <i class="fas fa-book me-2"></i>Books
          </h2>
          <button
            class="btn"
            [class.scroll-btn-light]="!isDark"
            [class.scroll-btn-dark]="isDark"
            (click)="openForm()"
          >
            <i class="fas fa-plus me-1"></i>Add New Book
          </button>
        </div>

        <!-- Form Card -->
        <div
          class="card glass-card mb-3"
          [class.glass-card-light]="!isDark"
          [class.glass-card-dark]="isDark"
          *ngIf="showForm"
        >
          <div class="card-body">
            <h5 [class.label-light]="!isDark" [class.label-dark]="isDark">
              {{ editing ? 'Edit Book' : 'New Book' }}
            </h5>
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label" [class.label-light]="!isDark" [class.label-dark]="isDark"
                  >Title</label
                >
                <input
                  class="form-control"
                  [class.scroll-input-light]="!isDark"
                  [class.scroll-input-dark]="isDark"
                  [class.is-invalid]="submitted && !form.title"
                  [(ngModel)]="form.title"
                  placeholder="Book title"
                />
                <div class="invalid-feedback">Title is required.</div>
              </div>
              <div class="col-md-4">
                <label class="form-label" [class.label-light]="!isDark" [class.label-dark]="isDark"
                  >Author</label
                >
                <input
                  class="form-control"
                  [class.scroll-input-light]="!isDark"
                  [class.scroll-input-dark]="isDark"
                  [class.is-invalid]="submitted && !form.author"
                  [(ngModel)]="form.author"
                  placeholder="Author name"
                />
                <div class="invalid-feedback">Author is required.</div>
              </div>
              <div class="col-md-4">
                <label class="form-label" [class.label-light]="!isDark" [class.label-dark]="isDark"
                  >Publication Date</label
                >
                <input
                  class="form-control"
                  type="date"
                  [class.scroll-input-light]="!isDark"
                  [class.scroll-input-dark]="isDark"
                  [class.is-invalid]="submitted && !form.publicationDate"
                  [(ngModel)]="form.publicationDate"
                />
                <div class="invalid-feedback">Date is required.</div>
              </div>
              <div class="col-md-4">
                <label class="form-label" [class.label-light]="!isDark" [class.label-dark]="isDark"
                  >Genre</label
                >
                <select
                  class="form-select"
                  [class.scroll-input-light]="!isDark"
                  [class.scroll-input-dark]="isDark"
                  [class.is-invalid]="submitted && !form.genre"
                  [(ngModel)]="form.genre"
                >
                  <option value="">Select genre</option>
                  <option *ngFor="let g of genres" [value]="g">{{ g }}</option>
                </select>
                <div class="invalid-feedback">Genre is required.</div>
              </div>
              <div class="col-md-4">
                <label class="form-label" [class.label-light]="!isDark" [class.label-dark]="isDark"
                  >Reading Status</label
                >
                <select
                  class="form-select"
                  [class.scroll-input-light]="!isDark"
                  [class.scroll-input-dark]="isDark"
                  [(ngModel)]="form.readingStatus"
                >
                  <option value="Want to Read">📋 Want to Read</option>
                  <option value="Reading">📖 Reading</option>
                  <option value="Finished">✅ Finished</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label" [class.label-light]="!isDark" [class.label-dark]="isDark"
                  >Rating</label
                >
                <div class="d-flex gap-1 mt-1">
                  <span
                    *ngFor="let star of [1, 2, 3, 4, 5]"
                    class="star"
                    [class.star-filled]="star <= form.rating"
                    [class.star-empty]="star > form.rating"
                    (click)="form.rating = star"
                  >
                    <i class="fas fa-star"></i>
                  </span>
                </div>
              </div>
            </div>
            <div class="mt-3 d-flex gap-2">
              <button
                class="btn"
                [class.scroll-btn-light]="!isDark"
                [class.scroll-btn-dark]="isDark"
                (click)="save()"
                [disabled]="loading"
              >
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                <i *ngIf="!loading" class="fas fa-save me-1"></i>
                {{ loading ? 'Saving...' : editing ? 'Update' : 'Save' }}
              </button>
              <button class="btn btn-secondary" (click)="cancelForm()">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Search and Filter -->
        <div
          class="card glass-card mb-3"
          [class.glass-card-light]="!isDark"
          [class.glass-card-dark]="isDark"
        >
          <div class="card-body py-2">
            <div class="row g-2">
              <div class="col-md-5">
                <div class="input-group">
                  <span
                    class="input-group-text border-end-0"
                    [style.background]="isDark ? 'rgba(30,18,3,0.7)' : 'rgba(255,250,220,0.85)'"
                    [style.border-color]="isDark ? 'rgba(180,120,30,0.4)' : 'rgba(180,130,40,0.5)'"
                  >
                    <i class="fas fa-search" [style.color]="isDark ? '#ffc850' : '#8B6914'"></i>
                  </span>
                  <input
                    class="form-control border-start-0"
                    [class.scroll-input-light]="!isDark"
                    [class.scroll-input-dark]="isDark"
                    [(ngModel)]="searchTerm"
                    placeholder="Search by title or author..."
                    (ngModelChange)="onSearch()"
                  />
                  <button
                    *ngIf="searchTerm"
                    class="btn btn-secondary btn-sm"
                    (click)="clearSearch()"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div class="col-md-4">
                <select
                  class="form-select"
                  [class.scroll-input-light]="!isDark"
                  [class.scroll-input-dark]="isDark"
                  [(ngModel)]="selectedGenre"
                  (ngModelChange)="onSearch()"
                >
                  <option value="">All Genres</option>
                  <option *ngFor="let g of genres" [value]="g">{{ g }}</option>
                </select>
              </div>
              <div class="col-md-3">
                <select
                  class="form-select"
                  [class.scroll-input-light]="!isDark"
                  [class.scroll-input-dark]="isDark"
                  [(ngModel)]="selectedStatus"
                  (ngModelChange)="onSearch()"
                >
                  <option value="">All Statuses</option>
                  <option value="Want to Read">📋 Want to Read</option>
                  <option value="Reading">📖 Reading</option>
                  <option value="Finished">✅ Finished</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Results count -->
        <p
          class="small mb-2"
          *ngIf="searchTerm || selectedGenre || selectedStatus"
          [style.color]="isDark ? '#ffc850' : '#8B6914'"
        >
          Showing {{ filteredBooks.length }} of {{ books.length }} books
        </p>

        <!-- Table -->
        <div
          class="card glass-card"
          [class.glass-card-light]="!isDark"
          [class.glass-card-dark]="isDark"
        >
          <div class="card-body p-0">
            <div class="table-responsive">
              <table
                class="table table-hover mb-0"
                [class.table-light-theme]="!isDark"
                [class.table-dark-theme]="isDark"
              >
                <thead>
                  <tr [style.background]="isDark ? 'rgba(80,45,5,0.6)' : 'rgba(200,150,50,0.3)'">
                    <th
                      style="cursor:pointer"
                      (click)="sort('title')"
                      [class.label-light]="!isDark"
                      [class.label-dark]="isDark"
                    >
                      <i class="fas fa-heading me-1"></i>Title
                      <i
                        class="fas ms-1"
                        [class.fa-sort]="sortColumn !== 'title'"
                        [class.fa-sort-up]="sortColumn === 'title' && sortDirection === 'asc'"
                        [class.fa-sort-down]="sortColumn === 'title' && sortDirection === 'desc'"
                      >
                      </i>
                    </th>
                    <th
                      style="cursor:pointer"
                      (click)="sort('author')"
                      [class.label-light]="!isDark"
                      [class.label-dark]="isDark"
                    >
                      <i class="fas fa-user me-1"></i>Author
                      <i
                        class="fas ms-1"
                        [class.fa-sort]="sortColumn !== 'author'"
                        [class.fa-sort-up]="sortColumn === 'author' && sortDirection === 'asc'"
                        [class.fa-sort-down]="sortColumn === 'author' && sortDirection === 'desc'"
                      >
                      </i>
                    </th>
                    <th [class.label-light]="!isDark" [class.label-dark]="isDark">
                      <i class="fas fa-tag me-1"></i>Genre
                    </th>
                    <th [class.label-light]="!isDark" [class.label-dark]="isDark">
                      <i class="fas fa-bookmark me-1"></i>Status
                    </th>
                    <th [class.label-light]="!isDark" [class.label-dark]="isDark">
                      <i class="fas fa-star me-1"></i>Rating
                    </th>
                    <th class="text-end" [class.label-light]="!isDark" [class.label-dark]="isDark">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="let book of pagedBooks"
                    [style.border-color]="isDark ? 'rgba(255,180,50,0.1)' : 'rgba(180,130,40,0.2)'"
                  >
                    <td>{{ book.title }}</td>
                    <td>{{ book.author }}</td>
                    <td>
                      <span
                        class="badge rounded-pill"
                        [class.bg-primary]="book.genre === 'Fiction'"
                        [class.bg-success]="book.genre === 'Science'"
                        [class.bg-warning]="book.genre === 'History'"
                        [class.bg-danger]="book.genre === 'Mystery'"
                        [class.bg-info]="book.genre === 'Biography'"
                        [class.bg-secondary]="book.genre === 'Technology'"
                        [class.bg-dark]="book.genre === 'Philosophy'"
                      >
                        {{ book.genre }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="badge"
                        [class.bg-warning]="book.readingStatus === 'Want to Read'"
                        [class.bg-primary]="book.readingStatus === 'Reading'"
                        [class.bg-success]="book.readingStatus === 'Finished'"
                      >
                        {{
                          book.readingStatus === 'Want to Read'
                            ? '📋'
                            : book.readingStatus === 'Reading'
                              ? '📖'
                              : '✅'
                        }}
                        {{ book.readingStatus }}
                      </span>
                    </td>
                    <td>
                      <span
                        *ngFor="let star of [1, 2, 3, 4, 5]"
                        [style.color]="star <= book.rating ? '#ffc107' : '#aaaaaa'"
                        style="font-size: 0.85rem;"
                      >
                        <i class="fas fa-star"></i>
                      </span>
                    </td>
                    <td class="text-end">
                      <button
                        class="btn btn-sm me-1"
                        [class.scroll-btn-light]="!isDark"
                        [class.scroll-btn-dark]="isDark"
                        (click)="edit(book)"
                        [disabled]="loading"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-sm"
                        style="background:rgba(180,40,40,0.6) !important; color:white !important; border:none; border-radius:8px"
                        (click)="confirmDelete(book)"
                        [disabled]="loading"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="filteredBooks.length === 0 && books.length > 0">
                    <td
                      colspan="6"
                      class="text-center py-4"
                      [style.color]="isDark ? '#ffc850' : '#8B6914'"
                    >
                      <i class="fas fa-search fa-2x d-block mb-2"></i>No books match your search.
                    </td>
                  </tr>
                  <tr *ngIf="books.length === 0">
                    <td
                      colspan="6"
                      class="text-center py-4"
                      [style.color]="isDark ? '#ffc850' : '#8B6914'"
                    >
                      <i class="fas fa-inbox fa-2x d-block mb-2"></i>No books yet. Add one!
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center mt-3" *ngIf="totalPages > 1">
          <small [style.color]="isDark ? '#ffc850' : '#8B6914'">
            Page {{ currentPage }} of {{ totalPages }}
          </small>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" [class.disabled]="currentPage === 1">
                <button class="page-link" (click)="goToPage(1)">
                  <i class="fas fa-angle-double-left"></i>
                </button>
              </li>
              <li class="page-item" [class.disabled]="currentPage === 1">
                <button class="page-link" (click)="goToPage(currentPage - 1)">
                  <i class="fas fa-angle-left"></i>
                </button>
              </li>
              <li
                class="page-item"
                *ngFor="let p of pageNumbers"
                [class.active]="p === currentPage"
              >
                <button class="page-link" (click)="goToPage(p)">{{ p }}</button>
              </li>
              <li class="page-item" [class.disabled]="currentPage === totalPages">
                <button class="page-link" (click)="goToPage(currentPage + 1)">
                  <i class="fas fa-angle-right"></i>
                </button>
              </li>
              <li class="page-item" [class.disabled]="currentPage === totalPages">
                <button class="page-link" (click)="goToPage(totalPages)">
                  <i class="fas fa-angle-double-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Export PDF Button -->
        <div class="mt-3 text-end">
          <button
            class="btn"
            [class.scroll-btn-light]="!isDark"
            [class.scroll-btn-dark]="isDark"
            (click)="exportPDF()"
          >
            <i class="fas fa-file-pdf me-1"></i>Export to PDF
          </button>
        </div>
      </div>

      <!-- Delete Modal -->
      <div
        class="modal fade"
        [class.show]="showModal"
        [style.display]="showModal ? 'block' : 'none'"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div
            class="modal-content"
            [class.glass-card-light]="!isDark"
            [class.glass-card-dark]="isDark"
            style="backdrop-filter: blur(12px); border-radius: 16px;"
          >
            <div class="modal-header border-0">
              <h5 class="modal-title text-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>Delete Book
              </h5>
              <button class="btn-close" (click)="showModal = false"></button>
            </div>
            <div class="modal-body text-center py-4">
              <i class="fas fa-trash fa-3x text-danger mb-3 d-block"></i>
              <p class="mb-1" [style.color]="isDark ? '#ffe8a0' : '#3d2000'">
                Are you sure you want to delete
              </p>
              <strong [style.color]="isDark ? '#ffc850' : '#8B6914'"
                >"{{ bookToDelete?.title }}"</strong
              >
              <p class="text-muted small mt-2">This action cannot be undone.</p>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-secondary" (click)="showModal = false">
                <i class="fas fa-times me-1"></i>Cancel
              </button>
              <button class="btn btn-danger" (click)="deleteConfirmed()" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                <i *ngIf="!loading" class="fas fa-trash me-1"></i>
                {{ loading ? 'Deleting...' : 'Yes, Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" *ngIf="showModal" (click)="showModal = false"></div>
    </div>
  `,
})
export class BooksComponent implements OnInit {
  private api = 'https://hogwards-vault.onrender.com/api/Books';
  books: Book[] = [];
  filteredBooks: Book[] = [];
  pagedBooks: Book[] = [];
  searchTerm = '';
  selectedGenre = '';
  selectedStatus = '';
  showForm = false;
  editing = false;
  submitted = false;
  loading = false;
  showModal = false;
  bookToDelete: Book | null = null;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pageNumbers: number[] = [];
  particles: any[] = [];
  form: Book = {
    title: '',
    author: '',
    publicationDate: '',
    genre: '',
    readingStatus: 'Want to Read',
    rating: 0,
  };
  editId?: number;

  genres = [
    'Fiction',
    'Science',
    'History',
    'Mystery',
    'Biography',
    'Technology',
    'Philosophy',
    'Romance',
    'Fantasy',
    'Self-Help',
    'Horror',
    'Poetry',
  ];

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
    this.http.get<Book[]>(this.api).subscribe((b) => {
      this.books = b;
      this.filterBooks();
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.filterBooks();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
    this.filterBooks();
  }

  filterBooks() {
    const term = this.searchTerm.toLowerCase();
    let result = this.books.filter(
      (b) =>
        (b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)) &&
        (this.selectedGenre === '' || b.genre === this.selectedGenre) &&
        (this.selectedStatus === '' || b.readingStatus === this.selectedStatus),
    );

    if (this.sortColumn) {
      result = result.sort((a, b) => {
        const valA = (a as any)[this.sortColumn].toString().toLowerCase();
        const valB = (b as any)[this.sortColumn].toString().toLowerCase();
        return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }

    this.filteredBooks = result;
    this.totalPages = Math.ceil(this.filteredBooks.length / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePage();
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedBooks = this.filteredBooks.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 1;
    this.filterBooks();
  }

  openForm() {
    this.form = {
      title: '',
      author: '',
      publicationDate: '',
      genre: '',
      readingStatus: 'Want to Read',
      rating: 0,
    };
    this.submitted = false;
    this.editing = false;
    this.showForm = true;
  }

  cancelForm() {
    this.showForm = false;
    this.submitted = false;
  }

  edit(book: Book) {
    this.form = { ...book, publicationDate: book.publicationDate.slice(0, 10) };
    this.editId = book.id;
    this.submitted = false;
    this.editing = true;
    this.showForm = true;
  }

  save() {
    this.submitted = true;
    if (!this.form.title || !this.form.author || !this.form.publicationDate || !this.form.genre)
      return;
    this.loading = true;

    if (this.editing) {
      this.http.put(`${this.api}/${this.editId}`, this.form).subscribe(() => {
        this.load();
        this.showForm = false;
        this.submitted = false;
        this.loading = false;
        this.toast.show('Book updated successfully!');
      });
    } else {
      this.http.post(this.api, this.form).subscribe(() => {
        this.load();
        this.showForm = false;
        this.submitted = false;
        this.loading = false;
        this.toast.show('Book added successfully!');
      });
    }
  }

  confirmDelete(book: Book) {
    this.bookToDelete = book;
    this.showModal = true;
  }

  deleteConfirmed() {
    if (!this.bookToDelete) return;
    this.loading = true;
    this.http.delete(`${this.api}/${this.bookToDelete.id}`).subscribe(() => {
      this.load();
      this.loading = false;
      this.showModal = false;
      this.bookToDelete = null;
      this.toast.show('Book deleted!', 'danger');
    });
  }

  exportPDF() {
    const printContent = `
      <html>
        <head>
          <title>BookVault - My Books</title>
          <style>
            body { font-family: Georgia, serif; padding: 20px; }
            h1 { color: #5c3d0a; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #c8960a; color: white; padding: 10px; text-align: left; }
            td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background: #fff8e7; }
            .stars { color: #ffc107; }
          </style>
        </head>
        <body>
          <h1>📚 BookVault - My Books</h1>
          <p style="text-align:center">Generated on ${new Date().toLocaleDateString()}</p>
          <table>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Status</th>
              <th>Rating</th>
            </tr>
            ${this.books
              .map(
                (b) => `
              <tr>
                <td>${b.title}</td>
                <td>${b.author}</td>
                <td>${b.genre}</td>
                <td>${b.readingStatus}</td>
                <td class="stars">${'★'.repeat(b.rating)}${'☆'.repeat(5 - b.rating)}</td>
              </tr>
            `,
              )
              .join('')}
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
