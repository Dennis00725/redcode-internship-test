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
          <div class="col-md-4">
            <label class="form-label">Title</label>
            <input
              class="form-control"
              [class.is-invalid]="submitted && !form.title"
              [(ngModel)]="form.title"
              placeholder="Book title"
            />
            <div class="invalid-feedback">Title is required.</div>
          </div>
          <div class="col-md-4">
            <label class="form-label">Author</label>
            <input
              class="form-control"
              [class.is-invalid]="submitted && !form.author"
              [(ngModel)]="form.author"
              placeholder="Author name"
            />
            <div class="invalid-feedback">Author is required.</div>
          </div>
          <div class="col-md-4">
            <label class="form-label">Publication Date</label>
            <input
              class="form-control"
              type="date"
              [class.is-invalid]="submitted && !form.publicationDate"
              [(ngModel)]="form.publicationDate"
            />
            <div class="invalid-feedback">Publication date is required.</div>
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

    <!-- Search Box -->
    <div class="card mb-3 shadow-sm">
      <div class="card-body py-2">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="fas fa-search text-muted"></i>
          </span>
          <input
            class="form-control border-start-0"
            [(ngModel)]="searchTerm"
            placeholder="Search by title or author..."
            (ngModelChange)="filterBooks()"
          />
          <button *ngIf="searchTerm" class="btn btn-outline-secondary" (click)="clearSearch()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Results count -->
    <p class="text-muted small mb-2" *ngIf="searchTerm">
      Showing {{ filteredBooks.length }} of {{ books.length }} books
    </p>

    <!-- Table -->
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-primary">
              <tr>
                <th><i class="fas fa-heading me-1"></i>Title</th>
                <th><i class="fas fa-user me-1"></i>Author</th>
                <th><i class="fas fa-calendar me-1"></i>Published</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let book of filteredBooks">
                <td>{{ book.title }}</td>
                <td>{{ book.author }}</td>
                <td>{{ book.publicationDate | date: 'mediumDate' }}</td>
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
                    (click)="delete(book.id!)"
                    [disabled]="loading"
                  >
                    <span *ngIf="loading" class="spinner-border spinner-border-sm"></span>
                    <i *ngIf="!loading" class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredBooks.length === 0 && books.length > 0">
                <td colspan="4" class="text-center text-muted py-4">
                  <i class="fas fa-search fa-2x d-block mb-2"></i>No books match your search.
                </td>
              </tr>
              <tr *ngIf="books.length === 0">
                <td colspan="4" class="text-center text-muted py-4">
                  <i class="fas fa-inbox fa-2x d-block mb-2"></i>No books yet. Add one!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class BooksComponent implements OnInit {
  private api = 'http://localhost:5187/api/Books';
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm = '';
  showForm = false;
  editing = false;
  submitted = false;
  loading = false;
  form: Book = { title: '', author: '', publicationDate: '' };
  editId?: number;

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

  filterBooks() {
    const term = this.searchTerm.toLowerCase();
    this.filteredBooks = this.books.filter(
      (b) => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term),
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredBooks = this.books;
  }

  openForm() {
    this.form = { title: '', author: '', publicationDate: '' };
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
    if (!this.form.title || !this.form.author || !this.form.publicationDate) return;
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

  delete(id: number) {
    if (confirm('Delete this book?')) {
      this.loading = true;
      this.http.delete(`${this.api}/${id}`).subscribe(() => {
        this.load();
        this.loading = false;
        this.toast.show('Book deleted!', 'danger');
      });
    }
  }
}
