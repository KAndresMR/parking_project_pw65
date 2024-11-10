import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpaceService } from '../../services/space.service';
import { Space } from '../../models/space.model';

@Component({
  selector: 'app-space-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './space-management.component.html',
  styleUrl: './space-management.component.scss'
})
export class SpaceManagementComponent implements OnInit{

  isEditing: boolean = false
  searchNumber: string = '';
  filterStatus: string = '';
  filterType: string = '';
  message: string | null = null;

  // Variable para almacenar los datos del espacio en el formulario
  spaceForm: Space = {
    id: '',
    number: 0,
    status: 'Disponible',
    type: 'Normal',
    price: 0
  };

  // Lista de espacios de parqueo
  spaces: Space[] = [];
  
  constructor(private spaceService: SpaceService) {}

  // Método para obtener los espacios filtrados
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

  ngOnInit() {
    this.loadSpaces();
  }    

  editSpace(space: Space) {
    this.spaceForm = { ...space };
    this.isEditing = true;
  }

  reserveSpace(space: Space) {
    this.spaceService.updateSpace(space.id!, { status: 'Ocupado' } as Partial<Space>).then(() => {
      this.loadSpaces();
    });
  }

  freeSpace(space: Space) {
    this.spaceService.updateSpace(space.id!, { status: 'Disponible' } as Partial<Space>).then(() => {
      this.loadSpaces();
    });
  }

  saveSpace() {
    if (this.isEditing) {
      this.message = 'Espacio actualizado exitosamente';
        setTimeout(() => (this.message = null), 3000);
      // Actualizar espacio existente
      this.spaceService.updateSpace(this.spaceForm.id!, this.spaceForm).then(() => {
        this.isEditing = false;
        this.resetForm();
        this.loadSpaces();
      });
    } else {
      this.message = 'Espacio registrado exitosamente';
        setTimeout(() => (this.message = null), 3000);
      // Crear nuevo espacio      
      this.spaceService.addSpace(this.spaceForm).then(() => {
        this.resetForm();
        this.loadSpaces();
      });
    }
  }

  // Método para restablecer el formulario después de guardar
  resetForm() {
    this.spaceForm = {
      id: '',      
      number: 0,
      status: 'Disponible',
      type: 'Normal',
      price: 0
    };
  }

  loadSpaces() {
    this.spaceService.getSpaces().then(spaces => {
      this.spaces = spaces;
    });
  }

  cancelEdit() {
    this.spaceForm = { number: 0, status: 'Disponible', type: 'Normal', price: 0 };
    this.isEditing = false;
  }

  private resetSpaceForm() {
    this.spaceForm = {
      id: '', // O si no necesitas `id` aquí, puedes omitirlo
      number: 0,
      status: 'Disponible',
      type: 'Normal',
      price: 0
    };
  }

}
