import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup; // Formulario de registro
  errorMessage: string = ''; // Mensaje de error para la validación
  message: string | null = null; // Mensaje de éxito tras registro

  // Modelo de usuario para registrar
  userForm: User = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'cliente',
    state: 'Inactivo'
  };

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private userService: UserService
  ) {}

  /**
   * Navega al formulario de inicio de sesión.
   */
  comeBack() {
    this.router.navigate(['/login']);
  }

  /**
   * Inicializa el formulario de registro con validaciones.
   */
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Registra un nuevo usuario.
   * Si el formulario es válido, intenta registrar al usuario a través del servicio.
   */
  async onRegister() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, complete el formulario correctamente.';
      return;
    }

    try {
      // Construir objeto usuario a partir de los valores del formulario
      const userForm: User = {
        id: '',
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: 'cliente',
        state: 'Inactivo',
      };

      // Llamada al servicio para registrar al usuario
      await this.userService.register(userForm.email, userForm.password, userForm.name);

      // Mensaje de éxito
      this.message = 'Usuario registrado exitosamente';
      setTimeout(() => (this.message = null), 3000); // Elimina mensaje después de 3 segundos
      this.registerForm.reset(); // Resetea el formulario
    } catch (error) {
      this.errorMessage = 'Error al registrar usuario. Intente nuevamente.';
    }
  }

  /**
   * Resetea el formulario de registro.
   */
  resetForm() {
    this.userForm = {
      id: '',
      name: '',
      email: '',
      password: '',
      role: 'cliente',
      state: 'Inactivo'
    };
  }

  /**
   * Redirige al formulario de inicio de sesión.
   */
  redirectToLogin() {
    this.router.navigate(['/login']);
  }

}
