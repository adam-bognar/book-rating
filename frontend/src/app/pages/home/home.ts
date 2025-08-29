import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Card } from '../../components/card/card';
import { Book } from '../../services/book';
import { BookDto } from '../../models/book';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Card],
  templateUrl: './home.html'
})
export class Home {
  readonly categories = [
    'All','Fiction','Science Fiction','Historical Fiction','Literary Fiction','Mystery','Thriller','Memoir','Self-Help'
  ];
  readonly sortFields = ['Title','Author','Rating','Release Date'];
  readonly sortDirections = ['A-Z','Z-A'];

  filterForm: FormGroup;

  categoryOpen = signal(false);
  fieldOpen = signal(false);

  loading = signal(true);
  error = signal<string | null>(null);
  booksSig = signal<BookDto[]>([]);

  private formSub?: Subscription;

  constructor(private fb: FormBuilder, private bookService: Book) {
    this.filterForm = this.fb.group({
      search: [''],
      category: ['All'],
      sortDir: ['A-Z']
    });
    this.setupReactiveLoading();
    this.loadBooks();
  }

  setupReactiveLoading() {
    this.formSub = this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged((a,b)=> JSON.stringify(a)===JSON.stringify(b)))
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadBooks();
      });
  }

  loadBooks() {
    this.loading.set(true);
    this.error.set(null);
    const raw = this.filterForm.value;
    const category = raw.category === 'All' ? null : raw.category;
    const order = raw.sortDir === 'Z-A' ? 'title' : null;
    const search = raw.search?.trim() || null;
    this.bookService.getBooks({ search, category, order }).subscribe({
  next: (data: BookDto[]) => { this.booksSig.set(data); this.loading.set(false); },
      error: (err: HttpErrorResponse) => { this.error.set(err.message); this.loading.set(false); }
    });
  }

  toggleDir() {
    const next = this.filterForm.value.sortDir === 'A-Z' ? 'Z-A' : 'A-Z';
    this.filterForm.patchValue({ sortDir: next });
  }
  submit() {  }
  get books() { return this.booksSig(); }

  pageSize = 12; 
  currentPage = signal(1);

  totalPages() { return Math.ceil(this.books.length / this.pageSize || 1); }
  pagedBooks() {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.books.slice(start, start + this.pageSize);
  }
  goTo(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
  }
}
