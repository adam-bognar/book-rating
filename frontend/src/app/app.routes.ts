import { Routes } from '@angular/router';
import { Signin } from './pages/signin/signin';
import { Signup } from './pages/signup/signup';
import { Home } from './pages/home/home';
import { Calendar } from './pages/calendar/calendar';
import { Profile } from './pages/profile/profile';
import { Book } from './pages/book/book';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: Home },
    { path: 'calendar', component: Calendar },
    { path: 'profile', component: Profile },
    { path: 'book/:id', component: Book },
    { path: 'signin', component: Signin },
    { path: 'signup', component: Signup }
];
