import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookDto } from '../../models/book';
import { Book as BookService} from '../../services/book';
import { LikeService } from '../../services/like';
import { HttpErrorResponse } from '@angular/common/http';
import { ReviewService } from '../../services/review';


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

  liked = signal(false);

  liking = signal(false);

  newRating = signal<number>(0);
  newText = signal('');
  submittingReview = signal(false);
  reviewError = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private bookService: BookService, private likeService: LikeService, private reviewService: ReviewService) {
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

  addToFavorite() {
    const book = this.bookSig();
    if (!book || this.liking() || this.liked()) return;
    this.liking.set(true);
    this.likeService.likeBook(book.id).subscribe({
      next: () => {
        this.liked.set(true);
        this.liking.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.status === 401 ? 'Please sign in to favorite books.' : err.message);
        this.liking.set(false);
      }
    });
  }

  canSubmitReview() {
    return this.newRating() > 0 && this.newText().trim().length > 0 && !this.submittingReview();
  }

  submitReview() {
    const book = this.bookSig();
    if (!book || !this.canSubmitReview()) return;
    this.submittingReview.set(true);
    this.reviewError.set(null);
    const payload = { rating: this.newRating(), text: this.newText().trim() };
    this.reviewService.addReview(book.id, payload).subscribe({
      next: rev => {
        const current = this.bookSig();
        if (current) {
          this.bookSig.set({ ...current, reviews: [...current.reviews, rev] });
        }
        this.newRating.set(0);
        this.newText.set('');
        this.submittingReview.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.reviewError.set(err.status === 401 ? 'Please sign in to submit a review.' : err.message);
        this.submittingReview.set(false);
      }
    });
  }
}
