import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,  
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit{
  users: User[] = [];

  searchTerm: string = '';
  filterRole: string = '';
  message: string | null = null;

  isEditing = false;
  userForm: User = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'cliente',
    state: 'Inactivo'  
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().then(users =>{
      this.users = users;
    })
  }



  editUser(user: User) {
    this.userForm = { ...user }; // Copiar los datos del contrato seleccionado
    this.isEditing = true; // Activar el modo edición
  }

  async deleteUser(user: User) {
    if (!user.id) {
      console.error("El contrato no tiene un ID válido:", user);
      return; // Sale de la función si el ID no es válido
    }
    await this.userService.deleteUser(user);
    this.loadUsers();
  }

  async saveUser() {
    if (this.isEditing) {
      this.message = 'Usuario actualizado exitosamente';
        setTimeout(() => (this.message = null), 3000);
      await this.userService.updateUser(this.userForm.id.toString(), this.userForm);
      this.loadUsers();
      this.resetForm()
    } else {
      this.message = 'Usuario registrado exitosamente';
        setTimeout(() => (this.message = null), 3000);
      await this.userService.register(this.userForm.email, this.userForm.password, this.userForm.name);
      this.loadUsers();
      this.resetForm()
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
  


  cancelEdit() {

  }

}
