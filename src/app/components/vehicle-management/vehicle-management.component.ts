import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/postgres/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-management.component.html',
  styleUrl: './vehicle-management.component.scss'
})
export class VehicleManagementComponent implements OnInit, OnDestroy{

  searchPlate: string = ''; // Buscar por placa
  filterVehicleType: string = ''; // Filtro por tipo de vehículo
  message: string | null = null;
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];

  private destroy$ = new Subject<void>();

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.loadVehicles();
  }

  /** Carga los vehiculos desde el servicio */
  loadVehicles() {
    this.vehicleService.getVehicles()
      .pipe(takeUntil(this.destroy$)) // Previene fugas de memoria
      .subscribe(
        (vehicles) => {
          console.log("Vehiculos: ",vehicles);
          this.vehicles = vehicles;
          this.applyFilters(); // Aplica filtros después de cargar los datos
        },
        (error) => {
          console.error('Error al cargar los vehículos:', error);
          this.message = 'Error al cargar los vehículos.';
        }
      );
  }

  

  /** Aplica los filtros */
  applyFilters() {
    this.filteredVehicles = this.vehicles.filter(vehicle => {
      const matchesPlate = this.searchPlate ? vehicle.plate.toLowerCase().includes(this.searchPlate.toLowerCase()) : true;
      const matchesType = this.filterVehicleType ? vehicle.vehicleType.toLowerCase() === this.filterVehicleType.toLowerCase() : true;
      return matchesPlate && matchesType;
    });
  }

  /** Limpia suscripciones al destruir el componente */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }





}
