import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BookDto } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7038/api';



  likeBook(bookId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/books/${bookId}/like`, {}, { withCredentials: true });
  }

  getLikedBooks(): Observable<BookDto[]> {
    return this.http.get<BookDto[]>(`${this.apiUrl}/users/me/likes`, { withCredentials: true });
  }
}
