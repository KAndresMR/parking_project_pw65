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
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  

  onLogin() {
    if (this.form.valid) {
      const email = this.form.value.email as string;
      const password = this.form.value.password as string;
      console.log('Iniciando sesión con:', email);
  
      this.authService.login(email, password).subscribe({
        next: (role) => {
          console.log('Rol obtenido:', role);
        },
        error: (error) => {
          this.error = 'Error en el inicio de sesión. Verifica tus credenciales.';
          console.error(error);
        }
      });
    } else {
      this.error = 'Por favor ingresa un correo y contraseña válidos.';
    }
  }
  

  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        console.log('Inicio de sesión exitoso con Google y redirigido a cliente.');
      },
      error: (error) => {
        this.error = 'Error al iniciar sesión con Google.';
        console.error(error);
      }
    });
  }
  
  

}
