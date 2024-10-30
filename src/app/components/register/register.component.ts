import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;
  errorMessage: string = '';
  

  constructor(
    private fb: FormBuilder, 
    private authService: AuthenticationService) {
      this.registerForm = this.fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }

  ngOnInit(): void {
    
  }

  async onRegister() {
    if ( this.registerForm.valid ) {
      const { name, email, password } = this.registerForm.value;
      try {
        await this.authService.registerUser(email, password, name);
      } catch (error: any) { // Cambia 'error' a 'error: any'
        this.errorMessage = error.message || 'Ocurrió un error en el registro.';
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }

  redirectToLogin() {
    
  }
  

}
