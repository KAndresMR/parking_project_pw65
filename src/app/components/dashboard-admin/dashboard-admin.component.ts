import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/firestore/dashboard.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceService } from '../../services/postgres/space.service';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/postgres/vehicle.service';
import { Space } from '../../models/space.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/postgres/user.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent {

  menuVisible: boolean = false;
  exitMenuVisible: boolean = false;
  vehiclePlateExit: string = '';
  availableSpaces: Space[] = [];  // Aquí guardas los espacios disponibles
  showModal: boolean = false;  // Controla la visibilidad del modal
  selectedSpace: Space | null = null;  // Espacio seleccionado
  vehicleForm: Vehicle = this.getDefaultVehicleForm();
  userForm: User = this.getDefaultUserForm();

  constructor(private router: Router, private dashboardService: DashboardService,
    private vehicleService: VehicleService, private spaceService: SpaceService, 
    private userService: UserService) { }

    private getDefaultUserForm(): User {
      const names = ['Juan Pérez', 'María López', 'Carlos Sánchez', 'Ana Torres', 'Luis Gómez'];
      const userName = this.getRandomElement(names);

      // Crear usuario aleatorio
      return {
        name: userName,
        email: this.generateRandomEmail(userName),
        password: this.generateRandomPassword(),
        role: 'cliente',
        state: 'Activo'
      };
    }

  /** Obtiene la estructura inicial del formulario */
  private getDefaultVehicleForm(): Vehicle {
    const colors = ['Azul', 'Amarillo', 'Negro', 'Blanco', 'Rojo', 'Verde', 'Gris'];
    const brands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Audi'];
    const vehicleTypes = ['Moto', 'Camioneta', 'Camion', 'Sedán', 'SUV', 'Deportivo'];
    const contacts = ['0991234567', '0987654321', '0976543210', '0965432109', '0954321098'];

    return {
      plate: '',
      ownerContact: this.getRandomElement(contacts),
      vehicleType: this.getRandomElement(vehicleTypes),
      color: this.getRandomElement(colors),
      brand: this.getRandomElement(brands),
      registrationDate: new Date(),
      // Espacio Ocupado por el cliente
      space: {
        number: 0, // Número del espacio
        status: 'Disponible', // Estado del espacio
        type: 'Normal' // Tipo del espacio
      },
      // Usuario propietario del vehiculo
      user: {
        name: '',
        email: '',
        password: '',
        role: 'cliente',
        state: 'Activo'
      },
    };
  }

  // BTN REGISTRO INGRESO
  registerEntry() {
    this.userService.registerUser(this.userForm).pipe(
      tap((newUser) => {
        this.userForm.id = newUser.id; // Asigna el ID recibido del backend
        this.selectUser(this.userForm);
        this.vehicleForm.ownerName = this.userForm.name;
        this.vehicleForm.user = newUser; // Asigna el usuario al vehículo
      }),
      switchMap(() => this.vehicleService.registerVehicle(this.vehicleForm)) // Registra el vehículo después del usuario
    ).subscribe({
      next: () => {
        alert('Vehículo registrado correctamente.');
        this.menuVisible = false;
        this.resetForm();
      },
      error: (err) => {
        console.error("❌ Error en el proceso:", err);
        alert('Error al registrar el usuario o vehículo.');
      }
    });
  }
  

  selectUser(user: User) {
    //this.selectedSpace = user;  // Asigna el espacio seleccionado
    this.vehicleForm.user = user;  // Asigna el espacio al formulario
  }

  // BTN REGISTRO DE SALIDA
  registerExit() {
    if (!this.vehiclePlateExit) {
      alert('Por favor, ingrese la placa del vehículo para registrar la salida.');
      return;
    }

    this.dashboardService.registerVehicleExit(this.vehiclePlateExit).subscribe({
      next: () => {
        alert('Salida registrada correctamente.');
        this.exitMenuVisible = false;
      },
      error: () => alert('Error al registrar la salida.')
    });
  }

  // Función para obtener un elemento aleatorio de una lista
  private getRandomElement(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Función para generar un correo electrónico aleatorio
  private generateRandomEmail(name: string): string {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    return `${name.toLowerCase().replace(/\s/g, '')}${Math.floor(Math.random() * 1000)}@${this.getRandomElement(domains)}`;
  }

  // Función para generar una contraseña aleatoria
  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8); // Genera una contraseña aleatoria de 8 caracteres
  }

  // Carga los espacios disponibles
  loadAvailableSpaces() {
    this.spaceService.getSpaces().subscribe(spaces => {
      this.availableSpaces = spaces.filter(space => space.status === 'Disponible');
    }, error => {
      console.error('Error al cargar espacios:', error);
    });
  }

  // Asigna el espacio seleccionado al formulario
  selectSpace(space: Space) {
    this.selectedSpace = space;  // Asigna el espacio seleccionado
    this.vehicleForm.space = space;  // Asigna el espacio al formulario
    this.closeSpaceModal();  // Cierra el modal al seleccionar
  }

  // Resaltar el espacio seleccionado
  isSelected(space: Space): boolean {
    //console.log('Seleccionado: ', this.selectedSpace?.number);
    return this.selectedSpace?.number === space.number;
  }


  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  toggleExitMenu() {
    this.exitMenuVisible = !this.exitMenuVisible;
  }

  resetForm() {
    this.vehicleForm = this.getDefaultVehicleForm();
  }

  // Abre el modal de selección de espacio
  openSpaceModal() {
    this.showModal = true;
    this.loadAvailableSpaces();
  }

  // Cierra el modal
  closeSpaceModal() {
    this.showModal = false;
  }


}