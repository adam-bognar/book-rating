import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book.html',
  styleUrl: './book.css'
})
export class Book {
  private readonly allBooks = [
    { id: 'atomic-habits', title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', releaseDate: 'Oct 2018', rating: 4.7 },
    { id: 'dune', title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', releaseDate: 'Aug 1965', rating: 4.6 }
  ];

  private readonly reviewsData: Record<string, { user: string; rating: number; text: string; date: string }[]> = {
    'atomic-habits': [
      { user: 'Alice', rating: 5, text: 'Life changing framework for improvement.', date: '2024-05-01' },
      { user: 'Ben', rating: 4, text: 'Great tactics, a bit repetitive in spots.', date: '2024-06-15' }
    ],
    'dune': [
      { user: 'Cara', rating: 5, text: 'Epic world-building and politics.', date: '2024-07-12' }
    ]
  };

  readonly bookId = signal<string>('');
  readonly book = computed(() => this.allBooks.find(b => b.id === this.bookId()) );
  readonly reviews = computed(() => this.reviewsData[this.bookId()] ?? []);

  constructor(route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get('id');
    if (id) this.bookId.set(id);
  }
}
