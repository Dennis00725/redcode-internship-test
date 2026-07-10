import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast show align-items-center text-white border-0 mb-2"
        [class.bg-success]="toast.type === 'success'"
        [class.bg-danger]="toast.type === 'danger'"
        [class.bg-warning]="toast.type === 'warning'">
        <div class="d-flex">
          <div class="toast-body">
            <i class="fas me-2"
              [class.fa-check-circle]="toast.type === 'success'"
              [class.fa-times-circle]="toast.type === 'danger'"
              [class.fa-exclamation-circle]="toast.type === 'warning'">
            </i>
            {{ toast.message }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}