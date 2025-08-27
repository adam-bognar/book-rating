import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup ,ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router){
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.router.navigate(['/']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
