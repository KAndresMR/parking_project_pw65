import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Horario {
  dia: string;
  inicio: string;
  fin: string;
}

@Component({
  selector: 'app-work-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-schedule.component.html',
  styleUrl: './work-schedule.component.scss'
})
export class WorkScheduleComponent {
  horarios: Horario[] = []; // Ahora especificamos que 'horarios' es un array de 'Horario'
  formularioVisible: boolean = false; // Controla la visibilidad del formulario
  editar: boolean = false; // Indica si estamos en modo de edición
  horarioSeleccionado: Horario = { dia: '', inicio: '', fin: '' }; // Inicializa el horario seleccionado

  constructor() {
    this.cargarHorarios(); // Carga los horarios iniciales
  }

  cargarHorarios() {
    // Aquí deberías implementar la lógica para cargar los horarios (por ejemplo, desde una API)
  }

  abrirFormulario(horario?: Horario) {
    if (horario) {
      this.editar = true;
      this.horarioSeleccionado = { ...horario }; // Cargar el horario a editar
  } else {
      this.editar = false;
      this.horarioSeleccionado = { dia: '', inicio: '', fin: '' }; // Inicializa un nuevo horario
  }
  this.formularioVisible = true; // Muestra el formulario
  }

  editarHorario(horario: any) {
    // Lógica para editar el horario
  }

  eliminarHorario(horario: any) {
    // Lógica para eliminar el horario
  }


  guardarHorario() {

  }

  cerrarFormulario() {

  }

  



}
