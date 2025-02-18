import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Schedule } from '../../models/schedule.model';
import { NotificationService } from '../../services/firestore/notification.service';
import { NotificationsComponent } from "../notifications/notifications.component";
import { ScheduleworkService } from '../../services/postgres/schedulework.service';

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
  // Lista de días válidos
  diasValidos: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  ordenAscendenteDia = true;
  scheduleForm: Schedule = this.getDefaultScheduleForm(); // Inicializa el horario seleccionado

  constructor(private scheduleService: ScheduleworkService, private notificationService: NotificationService) {
    this.cargarHorarios(); // Carga los horarios iniciales
  }

  private getDefaultScheduleForm(): Schedule {
      return { day: '', startTime: '', endTime: ''};
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

  cargarHorarios() {
    this.scheduleService.getSchedule().subscribe(
      (shedules) => {
        this.horarios = shedules;
      },
      (error) => {
        console.error('Error al cargar los horarios:', error);
      }
    );
  }

  abrirFormulario(horario?: Schedule) {
    if (horario) {
      this.editar = true;
      this.scheduleForm = { ...horario }; // Cargar el horario a editar
  } else {
      this.editar = false;
      this.scheduleForm = this.getDefaultScheduleForm();
  }
  this.formularioVisible = true; // Muestra el formulario
  }

  async editarHorario(horario: Schedule) {
    this.abrirFormulario(horario);
  }

  async eliminarHorario(horario: Schedule) {
    if (horario.id) { // Verificar si el id existe
      //await this.scheduleService.deleteHorario(horario.id); // Llama al servicio para eliminar el horario
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
      this.scheduleService.updateSchedule(this.scheduleForm).subscribe({
        next: () => {
          this.cerrarFormulario(); // Cierra el formulario al terminar
          this.cargarHorarios(); // Recarga los horarios para reflejar los cambios
        },
        error: () => alert('Error al actualizar el espacio.')
      });
    } else {
      this.scheduleService.registerSchedule(this.scheduleForm).subscribe({
        next: (newSchedule) => {
          console.log("Id del backEnd: ",newSchedule.id)
          this.scheduleForm.id = newSchedule.id;
          this.cerrarFormulario(); // Cierra el formulario al terminar
          this.cargarHorarios(); // Recarga los horarios para reflejar los cambios
        },
        error: () => alert('Error al registrar el espacio.')
      });
    }
  }

  cerrarFormulario() {
    this.formularioVisible = false;
    this.scheduleForm = this.getDefaultScheduleForm();
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
    const { day, startTime, endTime } = this.scheduleForm;
    return !!day && !!startTime && !!endTime; // Retorna true si todos los campos tienen valores
  }

  // Validación 2: Asegurarse de que la hora de inicio sea anterior a la de fin
  validarRangoDeTiempo(): boolean {
    const startTime = this.convertirHoraAMinutos(this.scheduleForm.startTime);
    const endTime = this.convertirHoraAMinutos(this.scheduleForm.endTime);
    return startTime < endTime; // Verifica que inicio sea antes que fin
  }

  // Validación 3: Evitar duplicados de horarios en el mismo día
  validarDuplicados(): boolean {
    return !this.horarios.some(horario => 
      horario.day === this.scheduleForm.day && 
      horario.startTime === this.scheduleForm.startTime &&
      horario.endTime === this.scheduleForm.endTime &&
      horario.id !== this.scheduleForm.id // Ignorar si es el mismo horario en edición
    );
  }

  // Validación 4: Evitar solapamientos de horarios
  validarConflictos(): boolean {
    const newStartTime = this.convertirHoraAMinutos(this.scheduleForm.startTime);
    const newEndTime = this.convertirHoraAMinutos(this.scheduleForm.endTime);

    return !this.horarios.some(horario => {
      if (horario.day === this.scheduleForm.day && horario.id !== this.scheduleForm.id) {
        const startTime = this.convertirHoraAMinutos(horario.startTime);
        const endTime = this.convertirHoraAMinutos(horario.endTime);

        // Detecta solapamientos: (A inicia antes de B termine) y (B inicia antes de A termine)
        return newStartTime < endTime && startTime < newEndTime;
      }
      return false;
    });
  }

  // Validación 5: Verificar que el día ingresado sea válido
  validarDia(): boolean {
    return this.diasValidos.includes(this.scheduleForm.day.trim());
  }

  // 🔹 Método auxiliar: Convierte "HH:mm" a minutos totales del día
  private convertirHoraAMinutos(hora: string): number {
    const [horas, minutos] = hora.split(":").map(Number);
    return horas * 60 + minutos;
  }
}
