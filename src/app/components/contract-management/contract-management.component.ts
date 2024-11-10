import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contract } from '../../models/contract.model';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-contract-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contract-management.component.html',
  styleUrl: './contract-management.component.scss'
})
export class ContractManagementComponent implements OnInit{

  contracts: Contract[] = [];
  message: string | null = null;

  contractForm: Contract = {
    id: '',
    clientName: '',
    startDate: '',
    endDate: '',
    status: 'Activo'
  };
  isEditing = false;
  searchText: string = '';
  filterStatus: string = '';


  constructor(private contractService: ContractService) {}

  ngOnInit() {
    this.loadContracts();
  }

  loadContracts() {
    this.contractService.getSpaces().then(contracts => {
      this.contracts = contracts;
    });
  }

  async saveContract() {
    if (this.isEditing) {
      this.message = 'Contrato actualizado exitosamente';
        setTimeout(() => (this.message = null), 3000);
      await this.contractService.updateContract(this.contractForm.id.toString(), this.contractForm);
    } else {
      this.message = 'Contrato registrado exitosamente';
        setTimeout(() => (this.message = null), 3000);
      await this.contractService.addContract(this.contractForm);
    }
    this.resetForm();
    this.loadContracts();
  }

  editContract(contract: Contract) {
    this.contractForm = { ...contract }; // Copiar los datos del contrato seleccionado
    this.isEditing = true; // Activar el modo edición
  }

  async deleteContract(contract: Contract) {
    if (!contract.id) {
      console.error("El contrato no tiene un ID válido:", contract);
      return; // Sale de la función si el ID no es válido
    }
    await this.contractService.deleteContract(contract.id.toString());
    this.loadContracts();
  }  

  cancelEdit() {
    this.resetForm();
    this.isEditing = false;
  }

  resetForm() {
    this.contractForm = {
      id: '',
      clientName: '',
      startDate: '',
      endDate: '',
      status: 'Activo'
    };
  }

  get filteredContracts(): Contract[] {
    return this.contracts.filter(contract => {
      // Búsqueda por nombre o ID
      const matchesSearchText = this.searchText 
        ? contract.clientName.toLowerCase().includes(this.searchText.toLowerCase()) || 
          contract.id.toString().includes(this.searchText) 
        : true;
      
      // Filtro por estado
      const matchesStatus = this.filterStatus 
        ? contract.status.toLowerCase() === this.filterStatus.toLowerCase() 
        : true;
      
      // Retorna verdadero solo si ambos filtros coinciden
      return matchesSearchText && matchesStatus;
    });
  }
  
  

}
