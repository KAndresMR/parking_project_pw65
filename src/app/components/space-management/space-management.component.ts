import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { SpaceService } from '../../services/firestore/space.service';
import { Space } from '../../models/space.model';
import { SpaceService } from '../../services/postgres/space.service';


@Component({
  selector: 'app-space-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './space-management.component.html',
  styleUrl: './space-management.component.scss'
})
export class SpaceManagementComponent implements OnInit {

  isEditing: boolean = false; // Estado de edición
  searchNumber: string = ''; // Número de espacio a buscar
  filterStatus: string = ''; // Filtro por estado del espacio (Disponible, Ocupado, etc.)
  filterType: string = ''; // Filtro por tipo de espacio
  message: string | null = null; // Mensaje de éxito al guardar o actualizar
  ordenAscendente: boolean = false; // Controla si el orden es ascendente o descendente

  // Lista de espacios de parqueo
  spaces: Space[] = [];

  // Objeto para almacenar los datos del espacio en el formulario
  spaceForm: Space = {
    id: '',
    number: 0,
    status: 'Disponible',
    type: 'Normal',
  };

  constructor(private spaceService: SpaceService, private service: SpaceService) {}

  /**
   * Alterna el orden de los espacios de parqueo.
   * Ordena los espacios por número, ascendente o descendente.
   */
  toggleOrden() {
    this.ordenAscendente = !this.ordenAscendente; // Alternar el orden
    this.spaces.sort((a, b) => this.ordenAscendente ? a.number - b.number : b.number - a.number);
  }

  /**
   * Filtra los espacios según los criterios especificados (número, estado, tipo).
   * @returns Lista de espacios filtrados.
   */
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

  /**
   * Método llamado cuando el componente es inicializado.
   * Carga los espacios de parqueo.
   */
  ngOnInit() {
    this.loadSpaces();
  }

  /**
   * Activa el modo de edición para un espacio específico.
   * @param space El espacio a editar.
   */
  editSpace(space: Space) {
    this.spaceForm = { ...space };
    this.isEditing = true;
  }

  /**
   * Guarda los cambios en el espacio.
   * Si es edición, actualiza el espacio, si es creación, agrega un nuevo espacio.
   */
  saveSpace() {
    if (this.isEditing) {
      this.message = 'Espacio actualizado exitosamente';
      setTimeout(() => (this.message = null), 3000); // Elimina el mensaje después de 3 segundos
      // Actualizar espacio existente
      /*this.spaceService.updateSpace(this.spaceForm.id!, this.spaceForm).then(() => {
        this.isEditing = false;
        this.resetForm();
        this.loadSpaces();
      });*/
    } else {
      setTimeout(() => (this.message = null), 3000); // Elimina el mensaje después de 3 segundos
      // Crear nuevo espacio      
      // Crear objeto Vehicle con valores del formulario
      const space: Space = { 
        id: '', // Se genera en el backend
        number: this.spaceForm.number,
        status: this.spaceForm.status, // Si no se ingresa, queda vacío
        type: this.spaceForm.type,
      };
      
      // Enviar datos al servicio para registrarlo en el backend
      this.service.registerSpace(space).subscribe({
        next: () => {
          alert('Espacio registrado correctamente.');
        },
        error: () => alert('Error al registrar el espacio.')
      });



      /*this.spaceService.addSpace(this.spaceForm).then(() => {
        this.resetForm();
        this.loadSpaces();
      });*/
      this.message = 'Espacio registrado exitosamente';
    }
  }

  /**
   * Método para restablecer el formulario después de guardar.
   */
  resetForm() {
    this.spaceForm = {
      id: '',
      number: 0,
      status: 'Disponible',
      type: 'Normal',
    };
  }

  /**
   * Carga los espacios de parqueo desde el servicio.
   */
  loadSpaces() {
    /*this.spaceService.getSpaces().then(spaces => {
      this.spaces = spaces;
    });*/
  }

  /**
   * Cancela la edición y restablece el formulario.
   */
  cancelEdit() {
    this.spaceForm = { number: 0, status: 'Disponible', type: 'Normal' };
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
