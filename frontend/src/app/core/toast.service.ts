import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'danger' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'danger' | 'warning' = 'success') {
    this.toasts.update(t => [...t, { message, type }]);
    setTimeout(() => {
      this.toasts.update(t => t.slice(1));
    }, 3000);
  }
}