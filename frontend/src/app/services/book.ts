import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookDto } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class Book {
  constructor() {
    
  }

  private http = inject(HttpClient);
  private apiUrl = "https://localhost:7038/api/book";

  getBooks(filters?: { search?: string | null; category?: string | null; order?: string | null }): Observable<BookDto[]> {
    let params = new HttpParams();
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.order) params = params.set('order', filters.order);
  return this.http.get<BookDto[]>(this.apiUrl, { params, withCredentials: true });
  }

  getBookByTitle(title: string): Observable<BookDto> {
  return this.http.get<BookDto>(`${this.apiUrl}/${title}`, { withCredentials: true });
  }

  createBook(payload: { Title: string; Author: string; Category: string; Published: string }): Observable<BookDto> {
  return this.http.post<BookDto>(this.apiUrl, payload, { withCredentials: true });
  }

  updateBook(id: string, payload: { Id: string; Title: string; Author: string; Category: string; Published: string }): Observable<BookDto> {
  return this.http.put<BookDto>(`${this.apiUrl}/${id}`, payload, { withCredentials: true });
  }

  deleteBook(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
