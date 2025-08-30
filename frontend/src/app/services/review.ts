import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewDto } from '../models/book';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private base = 'https://localhost:7038/api/books'; 

  getReviews(bookId: string): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.base}/${bookId}/reviews`, { withCredentials: true });
  }

  addReview(bookId: string, payload: { rating: number; text: string }): Observable<ReviewDto> {
    return this.http.post<ReviewDto>(`${this.base}/${bookId}/reviews`, { rating: payload.rating, text: payload.text }, { withCredentials: true });
  }
}
