import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Card } from '../../components/card/card';

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

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      category: ['All'],
      sortField: ['Title'],
      sortDir: ['A-Z']
    });
  }

  selectCategory(cat: string) {
    this.filterForm.patchValue({ category: cat });
    this.categoryOpen.set(false);
  }
  selectField(field: string) {
    this.filterForm.patchValue({ sortField: field });
    this.fieldOpen.set(false);
  }
  toggleDir() {
    const next = this.filterForm.value.sortDir === 'A-Z' ? 'Z-A' : 'A-Z';
    this.filterForm.patchValue({ sortDir: next });
  }
  submit() {
    console.log('Filters', this.filterForm.value);
  }
  // --- Books & Pagination ---
  readonly books = [
    { title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', rating: 4.7, releaseDate: 'Oct 2018' },
    { title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', rating: 4.6, releaseDate: 'Aug 1965' },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fiction', rating: 4.8, releaseDate: 'Sep 1937' },
    { title: 'Educated', author: 'Tara Westover', category: 'Memoir', rating: 4.5, releaseDate: 'Feb 2018' },
    { title: '1984', author: 'George Orwell', category: 'Fiction', rating: 4.7, releaseDate: 'Jun 1949' },
    { title: 'The Silent Patient', author: 'Alex Michaelides', category: 'Thriller', rating: 4.2, releaseDate: 'Feb 2019' },
    { title: 'The Midnight Library', author: 'Matt Haig', category: 'Fiction', rating: 4.1, releaseDate: 'Aug 2020' },
    { title: 'Becoming', author: 'Michelle Obama', category: 'Memoir', rating: 4.8, releaseDate: 'Nov 2018' },
    { title: 'Project Hail Mary', author: 'Andy Weir', category: 'Science Fiction', rating: 4.8, releaseDate: 'May 2021' },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', category: 'Mystery', rating: 4.1, releaseDate: 'Aug 2005' },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', category: 'Fiction', rating: 4.7, releaseDate: 'Mar 2007' },
    { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction', rating: 4.6, releaseDate: '2011' },
    { title: 'The Martian', author: 'Andy Weir', category: 'Science Fiction', rating: 4.7, releaseDate: 'Feb 2014' },
    { title: 'Gone Girl', author: 'Gillian Flynn', category: 'Thriller', rating: 4.0, releaseDate: 'May 2012' },
    { title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', rating: 3.9, releaseDate: '1988' },
    { title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Self-Help', rating: 4.4, releaseDate: 'Sep 2020' }
  ];

  pageSize = 12; 
  currentPage = signal(1);

  totalPages() { return Math.ceil(this.books.length / this.pageSize); }
  pagedBooks() {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.books.slice(start, start + this.pageSize);
  }
  goTo(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
  }
}
