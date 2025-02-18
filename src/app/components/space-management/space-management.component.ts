import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { SpaceService } from '../../services/firestore/space.service';
import { Space } from '../../models/space.model';
import { SpaceService } from '../../services/postgres/space.service';
import { ValidatorService } from '../../services/utils/validator.service';


@Component({
  selector: 'app-space-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './space-management.component.html',
  styleUrl: './space-management.component.scss'
})
export class SpaceManagementComponent implements OnInit {
  searchNumber: string = ''; // Número de espacio a buscar
  isEditing: boolean = false; // Estado de edición
  filterStatus: string = ''; // Filtro por estado del espacio (Disponible, Ocupado, etc.)
  filterType: string = ''; // Filtro por tipo de espacio
  message: string | null = null; // Mensaje de éxito al guardar o actualizar
  ordenAscendente: boolean = false; // Controla si el orden es ascendente o descendente
  spaces: Space[] = []; // Lista de espacios de parqueo

  // Formulario inicializado con valores por defecto
  spaceForm: Space = this.getDefaultSpaceForm();

  constructor(private spaceService: SpaceService, private validator: ValidatorService) {}

  ngOnInit() {
    this.loadSpaces();
  }

  /** Obtiene la estructura inicial del formulario */
  private getDefaultSpaceForm(): Space {
    return { number: 0, status: 'Disponible', type: 'Normal' };
  }

  /** Alterna el orden de los espacios de parqueo */
  toggleOrden() {
    this.ordenAscendente = !this.ordenAscendente; // Alternar el orden
    this.spaces.sort((a, b) => this.ordenAscendente ? a.number - b.number : b.number - a.number);
  }

  /** Filtra los espacios según los criterios especificados */
  getFilteredSpaces(): Space[] {
    return this.spaces.filter(space => {
      // Filtro por número de espacio
      const matchesNumber = this.searchNumber ? space.number.toString().includes(this.searchNumber) : true;
      // Filtro por estado (ignora mayúsculas/minúsculas para evitar problemas)
      const matchesStatus = this.filterStatus ? space.status.toLowerCase() === this.filterStatus.toLowerCase() : true;
      // Filtro por tipo (ignora mayúsculas/minúsculas)
      const matchesType = this.filterType ? space.type.toLowerCase() === this.filterType.toLowerCase() : true;
      return matchesNumber && matchesStatus && matchesType;
    });
  }

  /** Carga los espacios de parqueo desde el servicio */
  loadSpaces() {
    this.spaceService.getSpaces().subscribe(
      (spaces) => {
        this.spaces = spaces;
      },
      (error) => {
        console.error('Error al cargar los espacios:', error);
      }
    );
  }
  
  editSpace(space: Space) {
    this.spaceForm = { ...space };
    this.isEditing = true;
  }

  /** Guarda los cambios en un espacio (creación o edición) */
  saveSpace() {
    if (this.isEditing) {
      this.message = 'Espacio actualizado exitosamente';
      setTimeout(() => (this.message = null), 3000); // Elimina el mensaje después de 3 segundos
      this.spaceService.updateSpace(this.spaceForm).subscribe({
        next: () => {
          this.message = 'Espacio actualizado exitosamente';
          this.resetForm();
          this.loadSpaces();
        },
        error: () => alert('Error al actualizar el espacio.')
      });
    } else {
      setTimeout(() => (this.message = null), 3000); // Elimina el mensaje después de 3 segundos
      // Crear nuevo espacio      
      this.spaceService.registerSpace(this.spaceForm).subscribe({
        next: (newSpace) => {
          this.spaceForm.id = newSpace.id; // Asigna el ID recibido del backend
          this.resetForm();
          this.loadSpaces();
        },
        error: () => alert('Error al registrar el espacio.')
      });
      this.message = 'Espacio registrado exitosamente';
    }
  }

  /** Restablece el formulario a su estado inicial */
  resetForm() {
    this.spaceForm = this.getDefaultSpaceForm();
    this.isEditing = false;
  }

  cancelEdit() {
    this.resetForm();
    this.isEditing = false;
  }

  /**
   * Reserva un espacio de parqueo, cambiando su estado a "Ocupado".
   * @param space El espacio a reservar.
   */
  reserveSpace(space: Space) {
    /*this.spaceService.updateSpace(space.id!, { status: 'Ocupado' } as Partial<Space>).then(() => {
      this.loadSpaces();
    });*/
  }

  /**
   * Libera un espacio de parqueo, cambiando su estado a "Disponible".
   * @param space El espacio a liberar.
   */
  freeSpace(space: Space) {
    /*this.spaceService.updateSpace(space.id!, { status: 'Disponible' } as Partial<Space>).then(() => {
      this.loadSpaces();
    });*/
  }

}
