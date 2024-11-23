import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb = inject(FormBuilder);    
  error: string | null = null;

  constructor(private authService: AuthenticationService, private router: Router) {

  }

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });  
  

  async onLogin() {
    if (this.form.valid) {
      const email = this.form.value.email as string;
      const password = this.form.value.password as string;
      try{
        await this.authService.login(email, password);
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
      }            
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'No se encontró un usuario con ese correo.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      case 'auth/invalid-credential':
        return 'Error en las credenciales. Revisa tu correo y contraseña.';
      default:
        return 'Error inesperado en el inicio de sesión.';
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

  
  //Saber si hay un usuario autenticado
  currentUser() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          console.log('Datos del usuario:', user);
        } else {
          console.log('No hay usuario autenticado');
        }
      },
      error: (error) => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    });        
  }
  

}
