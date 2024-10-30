import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterOutlet, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthenticationService);
  router = inject(Router);
  error: string | null = null;

  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    const { email, password } = this.form.value;
    if (email && password) {
      this.authService.login(email, password).subscribe({
        next: () => this.redirectUser(),
        error: () => this.error = 'Error en las credenciales'
      });
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: () => this.redirectUser(),
      error: () => (this.error = 'Error al iniciar sesión con Google')
    });
  }

  redirectUser() {
    this.authService.getUserRole().subscribe(role => {
      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/admin']);
      }
    });
  }

}
