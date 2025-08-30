import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { BookDto } from '../../models/book';
import { LikeService } from '../../services/like';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  loading = signal(true);
  error = signal<string | null>(null);
  likedBooks = signal<BookDto[]>([]);

  

  constructor(private likeService: LikeService) {
    this.loadLikedBooks();
  }

  loadLikedBooks() {
    this.loading.set(true);
    this.error.set(null);
    this.likeService.getLikedBooks().subscribe({
      next: (books) => {
        this.likedBooks.set(books);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  

  getAverage(book: BookDto): number | null {
    const list = book.reviews || [];
    if (!list.length) return null;
    return list.reduce((s, r) => s + r.rating, 0) / list.length;
  }
}
  