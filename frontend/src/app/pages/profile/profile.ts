import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  likedBooks = [
    { title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', rating: 4.7, releaseDate: 'Oct 2018' },
    { title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', rating: 4.6, releaseDate: 'Aug 1965' },
    { title: 'Project Hail Mary', author: 'Andy Weir', category: 'Science Fiction', rating: 4.8, releaseDate: 'May 2021' },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fiction', rating: 4.8, releaseDate: 'Sep 1937' }
  ];
}
