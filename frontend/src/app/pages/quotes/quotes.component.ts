import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Quote { id?: number; text: string; author: string; }

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="fas fa-quote-left me-2 text-warning"></i>My Quotes</h2>
      <button class="btn btn-warning" (click)="openForm()">
        <i class="fas fa-plus me-1"></i>Add Quote
      </button>
    </div>

    <!-- Form -->
    <div class="card mb-4 shadow-sm" *ngIf="showForm">
      <div class="card-body">
        <h5>{{ editing ? 'Edit Quote' : 'New Quote' }}</h5>
        <div class="mb-3">
          <label class="form-label">Quote</label>
          <textarea 
            class="form-control"
            [class.is-invalid]="submitted && !form.text"
            [(ngModel)]="form.text" 
            rows="3" 
            placeholder="Enter quote text"></textarea>
          <div class="invalid-feedback">Quote text is required.</div>
        </div>
        <div class="mb-3">
          <label class="form-label">Author</label>
          <input 
            class="form-control"
            [class.is-invalid]="submitted && !form.author"
            [(ngModel)]="form.author" 
            placeholder="Who said this?">
          <div class="invalid-feedback">Author is required.</div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-warning" (click)="save()">
            <i class="fas fa-save me-1"></i>{{ editing ? 'Update' : 'Save' }}
          </button>
          <button class="btn btn-secondary" (click)="cancelForm()">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Quote Cards -->
    <div class="row g-3">
      <div class="col-md-6" *ngFor="let q of quotes">
        <div class="card h-100 shadow-sm border-warning">
          <div class="card-body">
            <p class="card-text fst-italic">
              <i class="fas fa-quote-left text-warning me-2"></i>{{ q.text }}
            </p>
            <p class="card-text text-end">
              <small class="text-muted">— {{ q.author }}</small>
            </p>
          </div>
          <div class="card-footer d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-outline-primary" (click)="edit(q)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" (click)="delete(q.id!)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-12 text-center text-muted py-5" *ngIf="quotes.length === 0">
        <i class="fas fa-comment-slash fa-2x d-block mb-2"></i>No quotes yet. Add your favorites!
      </div>
    </div>
  `
})
export class QuotesComponent implements OnInit {
  private api = 'http://localhost:5187/api/Quotes';
  quotes: Quote[] = [];
  showForm = false;
  editing = false;
  submitted = false;
  form: Quote = { text: '', author: '' };
  editId?: number;

  constructor(private http: HttpClient) {}
  ngOnInit() { this.load(); }

  load() { this.http.get<Quote[]>(this.api).subscribe(q => this.quotes = q); }

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

    if (this.editing) {
      this.http.put(`${this.api}/${this.editId}`, this.form).subscribe(() => {
        this.load(); this.showForm = false; this.submitted = false;
      });
    } else {
      this.http.post(this.api, this.form).subscribe(() => {
        this.load(); this.showForm = false; this.submitted = false;
      });
    }
  }

  delete(id: number) {
    if (confirm('Delete this quote?'))
      this.http.delete(`${this.api}/${id}`).subscribe(() => this.load());
  }
}