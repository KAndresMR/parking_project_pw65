import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/firestore/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,  
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  // Lista de usuarios cargada desde el servicio
  users: User[] = [];

  // Variables para los filtros de búsqueda
  searchTerm: string = ''; 
  filterRole: string = ''; 
  message: string | null = null; // Mensaje de éxito para la creación o actualización de usuario

  // Estado para saber si estamos en modo edición
  isEditing = false;

  // Objeto para almacenar los datos del usuario en el formulario
  userForm: User = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'cliente', // Rol por defecto
    state: 'Inactivo' // Estado por defecto
  };

  constructor(private userService: UserService) {}

  /**
   * Método llamado cuando el componente es inicializado.
   * Carga la lista de usuarios.
   */
  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Carga la lista de usuarios desde el servicio.
   */
  loadUsers() {
    this.userService.getUsers().then(users => {
      this.users = users;
    });
  }

  /**
   * Activa el modo de edición para un usuario específico.
   * @param user El usuario a editar.
   */
  editUser(user: User) {
    this.userForm = { ...user }; // Copia los datos del usuario seleccionado en el formulario
    this.isEditing = true; // Activa el modo edición
  }

  /**
   * Elimina un usuario.
   * @param user El usuario a eliminar.
   */
  async deleteUser(user: User) {
    if (!user.id) {
      console.error("El usuario no tiene un ID válido:", user);
      return; // Sale de la función si el ID no es válido
    }
    await this.userService.deleteUser(user); // Llama al servicio para eliminar al usuario
    this.loadUsers(); // Recarga la lista de usuarios
  }

  /**
   * Guarda los cambios en el usuario.
   * Si estamos editando un usuario, lo actualiza, de lo contrario lo crea.
   */
  async saveUser() {
    if (this.isEditing) {
      this.message = 'Usuario actualizado exitosamente';
      setTimeout(() => (this.message = null), 3000); // Elimina el mensaje después de 3 segundos
      await this.userService.updateUser(this.userForm.id.toString(), this.userForm); // Actualiza el usuario
      this.loadUsers(); // Recarga la lista de usuarios
      this.resetForm(); // Restablece el formulario
    } else {
      this.message = 'Usuario registrado exitosamente';
      setTimeout(() => (this.message = null), 3000); // Elimina el mensaje después de 3 segundos
      await this.userService.register(this.userForm.email, this.userForm.password, this.userForm.name); // Crea el nuevo usuario
      this.loadUsers(); // Recarga la lista de usuarios
      this.resetForm(); // Restablece el formulario
    }
  }

  /**
   * Restablece el formulario del usuario a su estado inicial.
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
   * Cancela la edición y restablece el formulario.
   */
  cancelEdit() {
    this.resetForm();
    this.isEditing = false;
  }

}
