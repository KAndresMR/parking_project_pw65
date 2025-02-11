import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/firestore/dashboard.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceService } from '../../services/postgres/space.service';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {
  occupiedSpaces: number = 0; // Espacios ocupados
  registeredUsers: number = 0; // Usuarios registrados
  activeContracts: number = 0; // Contratos activos

  menuVisible: boolean = false;
  exitMenuVisible: boolean = false;

  vehiclePlate: string = ''; // Para el número de placa ingresado
  entryDate: string = '';   // Para la fecha de ingreso
  assignedSpace: number | null = null; // Para el espacio asignado

  vehiclePlateExit: string = ''; // Placa del vehículo al salir
  
  constructor(private router: Router, private dashboardService: DashboardService, private spaceService: SpaceService) { }

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.dashboardService.getOccupiedSpaces().subscribe(count => this.occupiedSpaces = count);
    this.dashboardService.getRegisteredUsers().subscribe(count => this.registeredUsers = count);
    this.dashboardService.getActiveContracts().subscribe(count => this.activeContracts = count);
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  toggleExitMenu() {
    this.exitMenuVisible = !this.exitMenuVisible;
  }

  // BTN REGISTRO INGRESO
  registerEntry() {
    if (!this.vehiclePlate || !this.assignedSpace) {
      alert('Por favor, complete todos los campos para registrar el ingreso.');
      return;
    }

    // Crear objeto Vehicle con valores del formulario
    const vehiculo: Vehicle = { 
      id: '', // Se genera en el backend
      plate: this.vehiclePlate,
      ownerName: '', // Si no se ingresa, queda vacío
      ownerContact: '',
      vehicleType: '',
      color: '',
      brand: '',
      registrationDate: new Date() // Fecha y hora actual
    };

    // Enviar datos al servicio para registrarlo en el backend
    /*this.spaceService.registerVehicle(vehiculo).subscribe({
      next: () => {
        alert('Vehículo registrado correctamente.');
        this.menuVisible = false; // Cerrar menú tras registrar
        this.vehiclePlate = ''; // Limpiar campo de entrada
        this.assignedSpace = null;
      },
      error: () => alert('Error al registrar el vehículo.')
    });*/
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
        this.loadDashboardStats();
        this.exitMenuVisible = false;
      },
      error: () => alert('Error al registrar la salida.')
    });
  }

}