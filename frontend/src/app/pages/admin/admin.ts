import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../services/book';
import { BookDto } from '../../models/book';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  form: FormGroup;
  books = signal<BookDto[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  editingId = signal<string | null>(null); 

  readonly categories = [ 'Fiction','Science Fiction','Historical Fiction','Literary Fiction','Mystery','Thriller','Memoir','Self-Help' ];

  constructor(private fb: FormBuilder, private bookService: Book, private auth: AuthService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: [this.categories[0], Validators.required],
      published: ['', Validators.required]
    });
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.bookService.getBooks().subscribe({
      next: data => { this.books.set(data); this.loading.set(false); },
      error: err => { this.error.set(err.message || 'Failed to load'); this.loading.set(false); }
    });
  }

  isAdmin() {
    return this.auth.hasRole("Admin");
  }
  
  select(b: BookDto) {
  this.editingId.set(b.id);
    this.form.patchValue({
      title: b.title,
      author: b.author,
      category: b.category,
      published: b.published.substring(0,10)
    });
  }

  resetForm() {
  this.editingId.set(null);
    this.form.reset({ category: this.categories[0] });
  }

  submit() {
    if (this.form.invalid) return;
    const value = this.form.value as { title: string; author: string; category: string; published: string };
  const isoPublished = value.published.length === 10 ? value.published + 'T00:00:00Z' : value.published;
  const payloadCreate = { Title: value.title, Author: value.author, Category: value.category, Published: isoPublished };
  const id = this.editingId();
  const payloadUpdate = { Id: id!, Title: value.title, Author: value.author, Category: value.category, Published: isoPublished };
    this.loading.set(true);
  const obs = id ? this.bookService.updateBook(id, payloadUpdate) : this.bookService.createBook(payloadCreate);
    obs.subscribe({
  next: () => { this.resetForm(); this.load(); },
      error: err => { this.error.set(err.message || 'Save failed'); this.loading.set(false); }
    });
  }

  delete(b: BookDto, e: Event) {
    e.stopPropagation();
  if (!confirm(`Delete book "${b.title}"?`)) return;
    this.loading.set(true);
    this.bookService.deleteBook(b.id).subscribe({
      next: () => { this.load(); if (this.editingId() === b.id) this.resetForm(); },
      error: err => { this.error.set(err.message || 'Delete failed'); this.loading.set(false); }
    });
  }

}
