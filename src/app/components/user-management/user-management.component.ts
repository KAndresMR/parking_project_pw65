import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/postgres/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  // Variables para los filtros de búsqueda
  searchTerm: string = '';
  filterRole: string = '';
  message: string | null = null; // Mensaje de éxito para la creación o actualización de usuario
  isEditing = false; // Estado para saber si estamos en modo edición
  users: User[] = []; // Lista de usuarios cargada desde el servicio

  userForm: User = this.getDefaultUserForm();

  constructor(private userService: UserService) { }

  /**
   * Método llamado cuando el componente es inicializado.
   * Carga la lista de usuarios.
   */
  ngOnInit(): void {
    this.loadUsers();
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

  /**
   * Carga la lista de usuarios desde el servicio.
   */
  loadUsers() {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
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
    //await this.userService.deleteUser(user); // Llama al servicio para eliminar al usuario
    this.loadUsers(); // Recarga la lista de usuarios
  }

  /**
   * Guarda los cambios en el usuario.
   * Si estamos editando un usuario, lo actualiza, de lo contrario lo crea.
   */
  saveUser() {
    if (this.isEditing) {
      this.message = 'Usuario actualizado exitosamente';
      setTimeout(() => (this.message = null), 3000); // Elimina el mensaje después de 3 segundos
      this.userService.updateUser(this.userForm).subscribe({
        next: () => {
          this.message = 'Usuario actualizado exitosamente';
          this.resetForm(); // Restablece el formulario
          this.loadUsers(); // Recarga la lista de usuarios
        },
        error: () => alert('Error al registrar el usuario.')
      });
    } else {
      this.message = 'Usuario registrado exitosamente';
      setTimeout(() => (this.message = null), 3000); // Elimina el mensaje después de 3 segundos
      this.userService.registerUser(this.userForm).subscribe({
        next: (newUser) => {
          console.log("Id: ",newUser.id);
          this.userForm.id = newUser.id; // Asigna el ID recibido del backend
          this.resetForm(); // Restablece el formulario
          this.loadUsers(); // Recarga la lista de usuarios
        },
        error: () => alert('Error al registrar el usuario.')
      });
    }
  }

  /**Restablece el formulario del usuario a su estado inicial.*/
  resetForm() {
    this.userForm = this.getDefaultUserForm();
    this.isEditing = false;
  }

  /**Cancela la edición y restablece el formulario.*/
  cancelEdit() {
    this.resetForm();
    this.isEditing = false;
  }

}
