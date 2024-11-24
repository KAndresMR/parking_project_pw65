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
export class RegisterComponent implements OnInit{

  registerForm!: FormGroup;
  errorMessage: string = '';
  message: string | null = null;

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
    private userService: UserService) {
      
  }

  comeBack() {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onRegister() {    
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, complete el formulario correctamente.';
      return;
    }

    try {
      // Construir el objeto usuario desde el formulario
      const userForm: User = {
        id: '',
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: 'cliente',
        state: 'Inactivo',
      };

      await this.userService.register(userForm.email, userForm.password, userForm.name);

      this.message = 'Usuario registrado exitosamente';
      setTimeout(() => (this.message = null), 3000);
      this.registerForm.reset();
    } catch (error) {
      this.errorMessage = 'Error al registrar usuario. Intente nuevamente.';
    }
  }

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




  redirectToLogin() {
    
  }
  

}
