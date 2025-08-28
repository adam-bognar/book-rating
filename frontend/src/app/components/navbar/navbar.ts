import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  readonly navItems = [
    { label: 'Home', path: '/home', icon: 'home' },
    { label: 'Calendar', path: '/calendar', icon: 'calendar' },
    { label: 'Profile', path: '/profile', icon: 'user' }
  ];

  
}
