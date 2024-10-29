import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,  
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users = [
    { name: 'Juan Pérez', email: 'juan@example.com', role: 'admin', status: 'Activo' },
    { name: 'Ana López', email: 'ana@example.com', role: 'user', status: 'Activo' },
    // Agrega más usuarios aquí
  ];

  searchTerm: string = '';
  filterRole: string = '';

  isEditing = false;
  userForm = { name: '', email: '', role: 'user' };

  editUser(user: any) {

  }

  deleteUser(user: any) {

  }

  saveUser() {

  }

  cancelEdit() {

  }

}
