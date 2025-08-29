import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {
  @Input() title = '';
  @Input() author = '';
  @Input() category = '';
  @Input() rating: number | null = null;
  @Input() releaseDate = '';

  readonly favorited = signal(false);
  toggleFavorite() { this.favorited.update(v => !v); }

  constructor(private router: Router) {}

  navigateToBook() {
    if (!this.title) return;
    this.router.navigate(['/book', encodeURIComponent(this.title)]);
  }
}
