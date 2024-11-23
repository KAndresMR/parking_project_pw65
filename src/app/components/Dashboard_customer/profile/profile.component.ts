import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/Customer/profile.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { Auth } from '@angular/fire/auth';
import { from } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  profileForm: FormGroup;
  userId: string | null = null;
  isEditing: boolean = false;
  userProfile: any = { name: '', email: '' }; // Inicializar como un objeto vacío para evitar el error

  constructor(
    private router: Router,
    private auth: Auth,
    private fb: FormBuilder, 
    private profileService: ProfileService, 
    private authService: AuthenticationService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],    
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId(); // Obtener el ID del usuario
    console.log("Id del usuario: "+this.userId)
    if (this.userId) {      
      const id = this.userId
      this.getUserProfile(id); // Obtener perfil solo si userId está definido
    }
  }

  // Método para obtener el perfil del usuario
  getUserProfile(id: string) {
    this.profileService.getUserProfile(id).subscribe(
        (data) => {
          this.userProfile = data || { name: '', email: '' };
        },
        (error) => {
            console.error("Error al cargar el perfil:", error);
        }
    );
  }

  // Cambia al modo edición para que el usuario pueda actualizar el perfil
  editProfile(): void {
    this.isEditing = true;
  }

  // Método para actualizar el perfil del usuario
  updateUserProfile(): void {
    // Verificar si `userId` es no nulo
    if (this.userId) {
      const updatedData = {
        name: this.userProfile.name,
        email: this.userProfile.email,
        // Otros campos del perfil
      };

      this.profileService.updateUserProfile(this.userId, updatedData)
        .then(() => {
          console.log("Perfil actualizado correctamente");
          this.isEditing = false; // Salir del modo de edición
        })
        .catch((error) => {
          console.error("Error al actualizar el perfil:", error);
        });
    } else {
      console.error("No se pudo obtener el ID de usuario para actualizar el perfil");
    }
  }

  // Cancelar el modo de edición y restaurar valores del formulario
  cancelEdit(): void {
    this.isEditing = false;
    if (this.userId) {
      this.getUserProfile(this.userId); // Restaura los valores originales del perfil
    }    
  }

  logout() {
    this.router.navigate(['/login']);
    return from(this.auth.signOut());    
  }

}
