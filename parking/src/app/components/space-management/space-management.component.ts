import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Space {
  number: number;
  status: string; // 'Disponible' o 'Ocupado'
  type: string;   // 'Normal' o 'Discapacitados'
  price: number;
}

@Component({
  selector: 'app-space-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './space-management.component.html',
  styleUrl: './space-management.component.scss'
})
export class SpaceManagementComponent {

  isEditing: boolean = false

  // Variable para almacenar los datos del espacio en el formulario
  spaceForm: Space = {
    number: 0,
    status: 'Disponible',
    type: 'Normal',
    price: 0
  };
  // Lista de espacios de parqueo
  spaces: Space[] = [
    { number: 1, status: 'Disponible', type: 'Normal', price: 5 },
    { number: 2, status: 'Ocupado', type: 'Normal', price: 5 },
    { number: 3, status: 'Disponible', type: 'Discapacitados', price: 7 },
    { number: 4, status: 'Ocupado', type: 'Normal', price: 5 },
    { number: 5, status: 'Disponible', type: 'Normal', price: 5 }
  ];

  

  editSpace(space: object) {

  }

  reserveSpace(space: object) {

  }

  freeSpace(space: object) {

  }

  saveSpace() {

  }

  cancelEdit() {

  }

}
