import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookDto } from '../../models/book';
import { Book as BookService} from '../../services/book';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book.html',
  styleUrl: './book.css'
})
export class Book {
  loading = signal(true);
  error = signal<string | null>(null);
  bookSig = signal<BookDto | null>(null);
  
  reviews = computed(() => this.bookSig()?.reviews ?? []);
  averageRating = computed(() => {
    const list = this.reviews();
    if (!list.length) return null;
    return list.reduce((sum, r) => sum + r.rating, 0) / list.length;
  });

  constructor(private route: ActivatedRoute, private bookService: BookService) {
    this.loadBook();
  }

  loadBook(){
    this.loading.set(true);
    this.error.set(null);
    const raw = this.route.snapshot.paramMap.get('id'); 
    if(!raw){
      this.error.set('Missing book title in URL');
      this.loading.set(false);
      return;
    }

    const encodedTitle = encodeURIComponent(raw);
    this.bookService.getBookByTitle(encodedTitle).subscribe({
      next: (data: BookDto) => {
        this.bookSig.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
