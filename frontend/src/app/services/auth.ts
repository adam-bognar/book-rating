import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7038/api/account';

  isAuthed = signal<boolean | null>(null);
  email = signal<string | null>(null);
  roles = signal<string[]>([]);

  constructor() { this.refreshMe(); }

  private setAnon() { this.isAuthed.set(false); this.email.set(null); this.roles.set([]); }

  refreshMe() {
    this.http.get<{ email: string; roles: string[] }>(`${this.apiUrl}/me`, { withCredentials: true }).subscribe({
      next: r => { this.isAuthed.set(true); this.email.set(r.email); this.roles.set(r.roles || []); console.log(r); },
      error: _ => this.setAnon()
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password, rememberMe: true }, { withCredentials: true }).pipe(
      tap(() => this.refreshMe())
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username: '', email, password }, { withCredentials: true }).pipe(
      tap(() => this.refreshMe())
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.refreshMe())
    );
  }

  hasRole(role: string) { return this.roles().includes(role); }
}
