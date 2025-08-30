import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup ,ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class Signin {
  signinForm: FormGroup;
  showPassword: boolean = false;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService){
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signinForm.invalid || this.loading()) return;
    const { email, password } = this.signinForm.value;
    this.loading.set(true); this.error.set(null);
    this.auth.login(email, password).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/home']); },
      error: err => { this.loading.set(false); this.error.set(err?.error || 'Login failed'); }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
