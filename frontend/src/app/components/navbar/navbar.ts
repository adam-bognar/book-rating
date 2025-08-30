import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  readonly staticItems = [
    { label: 'Home', path: '/home', icon: 'home' },
    { label: 'Calendar', path: '/calendar', icon: 'calendar' }
  ];
  constructor(private http: HttpClient, public auth: AuthService) { }

  navItems() {
  const state = this.auth.isAuthed();
  if (state === null) return this.staticItems; 
  if (state) {
      return [...this.staticItems, { label: 'Profile', path: '/profile', icon: 'user' }];
    }
    return [...this.staticItems, { label: 'Sign In', path: '/signin', icon: 'signin' }];
  }

  
}
