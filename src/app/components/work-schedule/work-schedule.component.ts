import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Schedule } from '../../models/schedule.model';
import { SheduleService } from '../../services/firestore/shedule.service';
import { NotificationService } from '../../services/firestore/notification.service';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-work-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './work-schedule.component.html',
  styleUrl: './work-schedule.component.scss'
})
export class WorkScheduleComponent implements OnInit{
  horarios: Schedule[] = []; // Ahora especificamos que 'horarios' es un array de 'Horario'
  formularioVisible: boolean = false; // Controla la visibilidad del formulario
  editar: boolean = false; // Indica si estamos en modo de edición
  horarioSeleccionado: Schedule = { id: '', day: '', start: '', end: '' }; // Inicializa el horario seleccionado
  // Lista de días válidos
  diasValidos: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  ordenAscendenteDia = true;

  constructor(private scheduleService: SheduleService, private notificationService: NotificationService) {
    this.cargarHorarios(); // Carga los horarios iniciales
  }

  ngOnInit() {
    const currentTime = new Date().getHours();
    if (currentTime >= 8 && currentTime <= 20) {
      this.notificationService.addNotification(
        'El parqueadero está abierto. Horario: 08:00 a 20:00'
      );
    }
  }

  toggleOrdenDia() {
    this.ordenAscendenteDia = !this.ordenAscendenteDia; // Alternar entre ascendente y descendente
  
    // Ordenar los horarios por día según el orden establecido
    const diasOrdenados = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
    this.horarios.sort((a, b) => {
      const indexA = diasOrdenados.indexOf(a.day);
      const indexB = diasOrdenados.indexOf(b.day);
      return this.ordenAscendenteDia ? indexA - indexB : indexB - indexA;
    });
  }

  // Validación 5: Verificar que el día ingresado sea válido
  validarDia(): boolean {
    return this.diasValidos.includes(this.horarioSeleccionado.day.trim());
  }

  cargarHorarios() {
    // Aquí deberías implementar la lógica para cargar los horarios (por ejemplo, desde una API)    
    this.scheduleService.getSchedules().then(contracts => {
      this.horarios = contracts;
    });
  }

  abrirFormulario(horario?: Schedule) {
    if (horario) {
      this.editar = true;
      this.horarioSeleccionado = { ...horario }; // Cargar el horario a editar
  } else {
      this.editar = false;
      this.horarioSeleccionado = {id:'', day: '', start: '', end: '' }; // Inicializa un nuevo horario
  }
  this.formularioVisible = true; // Muestra el formulario
  }

  async editarHorario(horario: Schedule) {
    this.abrirFormulario(horario);
  }

  async eliminarHorario(horario: Schedule) {
    if (horario.id) { // Verificar si el id existe
      await this.scheduleService.deleteHorario(horario.id); // Llama al servicio para eliminar el horario
      this.cargarHorarios(); // Recarga los horarios después de eliminar
    } else {
      console.error('Error: El horario no tiene un ID válido para eliminar');
    }
  }

  async guardarHorario() {
    if (!this.validarFormulario()) {
      return; // Si la validación falla, no continúa
    }
    if (this.editar) {
      await this.scheduleService.updateHorario(this.horarioSeleccionado); // Llama al servicio para actualizar el horario
    } else {
      await this.scheduleService.addHorario(this.horarioSeleccionado); // Llama al servicio para agregar un nuevo horario
    }
    this.cerrarFormulario(); // Cierra el formulario al terminar
    this.cargarHorarios(); // Recarga los horarios para reflejar los cambios
  }

  cerrarFormulario() {
    this.formularioVisible = false;
    this.horarioSeleccionado = { id:'', day: '', start: '', end: '' };
  }

  // Método general para validar el formulario
  validarFormulario(): boolean {
    // Llama a cada función de validación y muestra un alert en caso de error
    if (!this.validarCamposRequeridos()) {
      alert('Todos los campos son obligatorios.');
      return false;
    }
    if (!this.validarDia()) {
      alert('El día ingresado no es válido. Debe ser un día de la semana.');
      return false;
    }
    if (!this.validarFormatoHora(this.horarioSeleccionado.start) || !this.validarFormatoHora(this.horarioSeleccionado.end)) {
      alert('Las horas deben estar en formato HH:MM.');
      return false;
    }
    if (!this.validarRangoDeTiempo()) {
      alert('La hora de inicio debe ser anterior a la hora de fin.');
      return false;
    }
    if (!this.validarDuplicados()) {
      alert('Ya existe un horario para el mismo día.');
      return false;
    }
    if (!this.validarConflictos()) {
      alert('El horario se superpone con otro existente.');
      return false;
    }
    return true; // Si pasa todas las validaciones, retorna true
  }

  // Validación 1: Verificar que todos los campos requeridos estén llenos
  validarCamposRequeridos(): boolean {
    const { day, start, end } = this.horarioSeleccionado;
    return !!day && !!start && !!end; // Retorna true si todos los campos tienen valores
  }

  // Validación 2: Comprobar que el formato de las horas sea HH:MM
  validarFormatoHora(hora: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Expresión regular para formato 24 horas
    return regex.test(hora); // Retorna true si la hora tiene el formato correcto
  }

  // Validación 3: Asegurarse de que la hora de inicio sea anterior a la de fin
  validarRangoDeTiempo(): boolean {
    const [startHours, startMinutes] = this.horarioSeleccionado.start.split(':').map(Number);
    const [endHours, endMinutes] = this.horarioSeleccionado.end.split(':').map(Number);
    const startTime = startHours * 60 + startMinutes;
    const endTime = endHours * 60 + endMinutes;
    return startTime < endTime; // Retorna true si el inicio es antes del fin
  }

  // Validación 4: Evitar duplicados de horarios en el mismo día
  validarDuplicados(): boolean {
    return !this.horarios.some(horario => 
      horario.day === this.horarioSeleccionado.day && 
      horario.start === this.horarioSeleccionado.start &&
      horario.end === this.horarioSeleccionado.end &&
      horario.id !== this.horarioSeleccionado.id // Ignorar si es el mismo horario en edición
    );
  }

  // Validación 6: Evitar solapamientos de horarios
  validarConflictos(): boolean {
    const [newStartHours, newStartMinutes] = this.horarioSeleccionado.start.split(':').map(Number);
    const [newEndHours, newEndMinutes] = this.horarioSeleccionado.end.split(':').map(Number);
    const newStartTime = newStartHours * 60 + newStartMinutes;
    const newEndTime = newEndHours * 60 + newEndMinutes;

    // Recorre los horarios existentes para verificar conflictos
    return !this.horarios.some(horario => {
      if (horario.day === this.horarioSeleccionado.day && horario.id !== this.horarioSeleccionado.id) {
        const [startHours, startMinutes] = horario.start.split(':').map(Number);
        const [endHours, endMinutes] = horario.end.split(':').map(Number);
        const startTime = startHours * 60 + startMinutes;
        const endTime = endHours * 60 + endMinutes;

        // Verifica solapamientos: (A comienza antes que B termine) y (B comienza antes que A termine)
        return newStartTime < endTime && startTime < newEndTime;
      }
      return false;
    });
  }


}
