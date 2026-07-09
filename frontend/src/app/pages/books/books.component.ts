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
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="fas fa-book me-2 text-primary"></i>Books</h2>
      <button class="btn btn-primary" (click)="openForm()">
        <i class="fas fa-plus me-1"></i>Add New Book
      </button>
    </div>

    <!-- Form Card -->
    <div class="card mb-4 shadow-sm" *ngIf="showForm">
      <div class="card-body">
        <h5 class="card-title">{{ editing ? 'Edit Book' : 'New Book' }}</h5>
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Title</label>
            <input
              class="form-control"
              [class.is-invalid]="submitted && !form.title"
              [(ngModel)]="form.title"
              placeholder="Book title"
            />
            <div class="invalid-feedback">Title is required.</div>
          </div>
          <div class="col-md-3">
            <label class="form-label">Author</label>
            <input
              class="form-control"
              [class.is-invalid]="submitted && !form.author"
              [(ngModel)]="form.author"
              placeholder="Author name"
            />
            <div class="invalid-feedback">Author is required.</div>
          </div>
          <div class="col-md-3">
            <label class="form-label">Publication Date</label>
            <input
              class="form-control"
              type="date"
              [class.is-invalid]="submitted && !form.publicationDate"
              [(ngModel)]="form.publicationDate"
            />
            <div class="invalid-feedback">Publication date is required.</div>
          </div>
          <div class="col-md-3">
            <label class="form-label">Genre</label>
            <select
              class="form-select"
              [class.is-invalid]="submitted && !form.genre"
              [(ngModel)]="form.genre"
            >
              <option value="">Select genre</option>
              <option *ngFor="let g of genres" [value]="g">{{ g }}</option>
            </select>
            <div class="invalid-feedback">Genre is required.</div>
          </div>
        </div>
        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-success" (click)="save()" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
            <i *ngIf="!loading" class="fas fa-save me-1"></i>
            {{ loading ? 'Saving...' : editing ? 'Update' : 'Save' }}
          </button>
          <button class="btn btn-secondary" (click)="cancelForm()" [disabled]="loading">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="card mb-3 shadow-sm">
      <div class="card-body py-2">
        <div class="row g-2">
          <div class="col-md-8">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="fas fa-search text-muted"></i>
              </span>
              <input
                class="form-control border-start-0"
                [(ngModel)]="searchTerm"
                placeholder="Search by title or author..."
                (ngModelChange)="onSearch()"
              />
              <button *ngIf="searchTerm" class="btn btn-outline-secondary" (click)="clearSearch()">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="col-md-4">
            <select class="form-select" [(ngModel)]="selectedGenre" (ngModelChange)="onSearch()">
              <option value="">All Genres</option>
              <option *ngFor="let g of genres" [value]="g">{{ g }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Results count -->
    <p class="text-muted small mb-2" *ngIf="searchTerm || selectedGenre">
      Showing {{ filteredBooks.length }} of {{ books.length }} books
    </p>

    <!-- Table -->
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-primary">
              <tr>
                <th style="cursor:pointer" (click)="sort('title')">
                  <i class="fas fa-heading me-1"></i>Title
                  <i
                    class="fas ms-1"
                    [class.fa-sort]="sortColumn !== 'title'"
                    [class.fa-sort-up]="sortColumn === 'title' && sortDirection === 'asc'"
                    [class.fa-sort-down]="sortColumn === 'title' && sortDirection === 'desc'"
                  >
                  </i>
                </th>
                <th style="cursor:pointer" (click)="sort('author')">
                  <i class="fas fa-user me-1"></i>Author
                  <i
                    class="fas ms-1"
                    [class.fa-sort]="sortColumn !== 'author'"
                    [class.fa-sort-up]="sortColumn === 'author' && sortDirection === 'asc'"
                    [class.fa-sort-down]="sortColumn === 'author' && sortDirection === 'desc'"
                  >
                  </i>
                </th>
                <th style="cursor:pointer" (click)="sort('publicationDate')">
                  <i class="fas fa-calendar me-1"></i>Published
                  <i
                    class="fas ms-1"
                    [class.fa-sort]="sortColumn !== 'publicationDate'"
                    [class.fa-sort-up]="sortColumn === 'publicationDate' && sortDirection === 'asc'"
                    [class.fa-sort-down]="
                      sortColumn === 'publicationDate' && sortDirection === 'desc'
                    "
                  >
                  </i>
                </th>
                <th style="cursor:pointer" (click)="sort('genre')">
                  <i class="fas fa-tag me-1"></i>Genre
                  <i
                    class="fas ms-1"
                    [class.fa-sort]="sortColumn !== 'genre'"
                    [class.fa-sort-up]="sortColumn === 'genre' && sortDirection === 'asc'"
                    [class.fa-sort-down]="sortColumn === 'genre' && sortDirection === 'desc'"
                  >
                  </i>
                </th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let book of pagedBooks">
                <td>{{ book.title }}</td>
                <td>{{ book.author }}</td>
                <td>{{ book.publicationDate | date: 'mediumDate' }}</td>
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
                    [class.bg-primary]="book.genre === 'Romance'"
                  >
                    {{ book.genre }}
                  </span>
                </td>
                <td class="text-end">
                  <button
                    class="btn btn-sm btn-outline-primary me-1"
                    (click)="edit(book)"
                    [disabled]="loading"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    (click)="confirmDelete(book)"
                    [disabled]="loading"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredBooks.length === 0 && books.length > 0">
                <td colspan="5" class="text-center text-muted py-4">
                  <i class="fas fa-search fa-2x d-block mb-2"></i>No books match your search.
                </td>
              </tr>
              <tr *ngIf="books.length === 0">
                <td colspan="5" class="text-center text-muted py-4">
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
      <small class="text-muted">Page {{ currentPage }} of {{ totalPages }}</small>
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
          <li class="page-item" *ngFor="let p of pageNumbers" [class.active]="p === currentPage">
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

    <!-- Delete Confirmation Modal -->
    <div
      class="modal fade"
      [class.show]="showModal"
      [style.display]="showModal ? 'block' : 'none'"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title text-danger">
              <i class="fas fa-exclamation-triangle me-2"></i>Delete Book
            </h5>
            <button class="btn-close" (click)="showModal = false"></button>
          </div>
          <div class="modal-body text-center py-4">
            <i class="fas fa-trash fa-3x text-danger mb-3 d-block"></i>
            <p class="mb-1">Are you sure you want to delete</p>
            <strong>"{{ bookToDelete?.title }}"</strong>
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

    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show" *ngIf="showModal" (click)="showModal = false"></div>
  `,
})
export class BooksComponent implements OnInit {
  private api = 'http://localhost:5187/api/Books';
  books: Book[] = [];
  filteredBooks: Book[] = [];
  pagedBooks: Book[] = [];
  searchTerm = '';
  selectedGenre = '';
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
  form: Book = { title: '', author: '', publicationDate: '', genre: '' };
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

  constructor(
    private http: HttpClient,
    private toast: ToastService,
  ) {}
  ngOnInit() {
    this.load();
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
        (this.selectedGenre === '' || b.genre === this.selectedGenre),
    );

    if (this.sortColumn) {
      result = result.sort((a, b) => {
        const valA = (a as any)[this.sortColumn].toLowerCase();
        const valB = (b as any)[this.sortColumn].toLowerCase();
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
    this.form = { title: '', author: '', publicationDate: '', genre: '' };
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
}
