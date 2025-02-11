import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit{

  selectedPeriod: string = 'daily';  // Filtrado por día por defecto
  parkingHistory: any[] = []; // Array de historial de parqueos
  reports: any[] = []; // Array de reportes

  ngOnInit() {
    this.loadParkingHistory();
    this.loadReports();
  }

  // Simulación de la carga de datos de historial de parqueos
  loadParkingHistory() {

    /*this.parkingService.getParkingHistory(this.selectedPeriod).subscribe(data => {
      this.parkingHistory = data;
    });*/
    // Esto se debe conectar al servicio de backend
    this.parkingHistory = [
      { date: '2025-01-10', plate: 'ABC123', space: 'A1', entryTime: '08:00', exitTime: '12:00' },
      { date: '2025-01-10', plate: 'XYZ456', space: 'B2', entryTime: '09:00', exitTime: '11:30' },
      // Agregar más registros según el periodo seleccionado (diario, semanal, mensual)
    ];
  }

  // Simulación de la carga de reportes
  loadReports() {

    /*this.parkingService.getReports().subscribe(data => {
      this.reports = data;
    });*/
    // Aquí puedes definir los reportes según lo que se necesite
    this.reports = [
      { title: 'Reporte de Espacios Ocupados', details: 'Número total de espacios ocupados en el día de hoy' },
      { title: 'Reporte de Ingresos', details: 'Total de ingresos por parqueo en la última semana' }
    ];
  }
}
