import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models/ticket.model';
import { Subject, takeUntil } from 'rxjs';
import { TicketService } from '../../services/postgres/ticket.service';

@Component({
  selector: 'app-ticket-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-management.component.html',
  styleUrl: './ticket-management.component.scss'
})
export class TicketManagementComponent {

    searchPlate: string = ''; 
    filterTicketType: string = '';
    message: string | null = null;
    tickets: Ticket[] = [];
    filteredTickets: Ticket[] = [];
  
    private destroy$ = new Subject<void>();

    constructor(private ticketService: TicketService) { }

  ngOnInit() {
      this.loadVehicles();
    }
  
    /** Carga los vehiculos desde el servicio */
    loadVehicles() {
      this.ticketService.getTickets()
        .pipe(takeUntil(this.destroy$)) // Previene fugas de memoria
        .subscribe(
          (tickets) => {
            console.log("Vehiculos: ",tickets);
            this.tickets = tickets;
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
      this.filteredTickets = this.tickets.filter(ticket => {
        const matchesPlate = this.searchPlate ? ticket.state.toLowerCase().includes(this.searchPlate.toLowerCase()) : true;
        return matchesPlate;
      });
    }
  
    /** Limpia suscripciones al destruir el componente */
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }


}
