import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contract-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contract-management.component.html',
  styleUrl: './contract-management.component.scss'
})
export class ContractManagementComponent {
  contracts = [
    { id: 1, clientName: 'Cliente A', startDate: '2024-01-01', endDate: '2025-01-01', status: 'Activo' },
    { id: 2, clientName: 'Cliente B', startDate: '2023-01-01', endDate: '2024-01-01', status: 'Inactivo' },
    // Más contratos...
  ];

  contractForm = {
    clientName: '',
    startDate: '',
    endDate: '',
    status: 'Activo'
  };
  isEditing = false;

  editContract(contract:any) {

  }

  deleteContract(contract:any) {

  }

  saveContract() {

  }

  cancelEdit() {

  }

  resetForm() {

  }

}
