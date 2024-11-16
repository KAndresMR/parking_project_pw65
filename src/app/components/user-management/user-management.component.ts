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

  isEditing = false;
  userForm = { name: '', email: '', role: 'user' };

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
    if (!user.uid) {
      console.error("El contrato no tiene un ID válido:", user);
      return; // Sale de la función si el ID no es válido
    }
    await this.userService.deleteUser(user.uid.toString());
    this.loadUsers();
  }

  saveUser() {

  }

  cancelEdit() {

  }

}
