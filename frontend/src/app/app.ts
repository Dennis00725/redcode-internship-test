import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `<app-navbar /><div class="container mt-4"><router-outlet /></div>`
})
export class AppComponent implements OnInit {
  ngOnInit() {
    if (localStorage.getItem('darkMode') === 'true')
      document.body.classList.add('dark-mode');
  }
}