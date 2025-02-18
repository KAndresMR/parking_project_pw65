import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/postgres/user.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  errorMessage: string = ''; // Mensaje de error para la validación
  message: string | null = null; // Mensaje de éxito tras registro

  // Modelo de usuario para registrar
  userForm: User = this.getDefaultUserForm();

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private userService: UserService
  ) {}

  /** Navega al formulario de inicio de sesión.*/
  comeBack() {
    this.router.navigate(['/login']);
  }

   /** Obtiene la estructura inicial del formulario */
  private getDefaultUserForm(): User {
    return {
      name: '',
      email: '',
      password: '',
      role: 'cliente',
      state: 'Inactivo'
    };
  }

  /** Inicializa el formulario de registro con validaciones.*/
  ngOnInit(): void {
    
  }

  async onRegister() {

    try {
      console.log("Los datos se van al servicio: "+this.userForm);
      // Llamada al servicio para registrar al usuario
      this.userService.registerUser(this.userForm).subscribe({
        next: (newUser) => {
          console.log("Id: ",newUser.id);
          this.userForm.id = newUser.id; // Asigna el ID recibido del backend
          this.resetForm(); // Restablece el formulario
        },
        error: () => alert('Error al registrar el usuario.')
      });

      // Mensaje de éxito
      this.message = 'Usuario registrado exitosamente';
      setTimeout(() => (this.message = null), 3000); // Elimina mensaje después de 3 segundos
    } catch (error) {
      this.errorMessage = 'Error al registrar usuario. Intente nuevamente.';
    }
  }

  /** Resetea el formulario de registro.*/
  resetForm() {
    this.userForm = this.getDefaultUserForm();
  }

  /**Redirige al formulario de inicio de sesión.*/
  redirectToLogin() {
    this.router.navigate(['/login']);
  }

}
