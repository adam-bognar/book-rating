import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signupForm: FormGroup;
  showPassword: boolean = false;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService){
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid || this.loading()) return;
    const { email, password } = this.signupForm.value;
    this.loading.set(true); this.error.set(null);
    this.auth.register(email, password).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/home']); },
      error: err => { this.loading.set(false); this.error.set(err?.error || 'Registration failed'); }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
