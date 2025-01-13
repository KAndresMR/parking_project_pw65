import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {
  occupiedSpaces: number = 0; // Espacios ocupados
  registeredUsers: number = 0; // Usuarios registrados
  activeContracts: number = 0; // Contratos activos

  constructor(private router: Router, private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getOccupiedSpaces().subscribe(count => this.occupiedSpaces = count);
    this.dashboardService.getRegisteredUsers().subscribe(count => this.registeredUsers = count);
    this.dashboardService.getActiveContracts().subscribe(count => this.activeContracts = count);
  }

  createContract() {
    this.router.navigate(['/admin/contract']);
  }

  addSpace() {
    this.router.navigate(['/admin/space']);
  }

  manageUsers() {
    this.router.navigate(['/admin/user']);
  }
  
}
