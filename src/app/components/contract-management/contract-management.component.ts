import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contract } from '../../models/contract.model';
import { ContractService } from '../../services/contract.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { SpaceService } from '../../services/space.service';
import { Space } from '../../models/space.model';

@Component({
  selector: 'app-contract-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contract-management.component.html',
  styleUrl: './contract-management.component.scss'
})
export class ContractManagementComponent implements OnInit{

  contracts: Contract[] = []
  clients: User[] = []
  spaces: Space[] = []
  message: string | null = null
  isClientModalOpen: boolean = false
  isSpaceModalOpen: boolean = false
  isEditing = false
  searchText: string = ''
  filterStatus: string = ''
  selectedClientName: string = ''
  selectedSpaceNum: number = 0
  idSpace: string =''
  idUser: string =''

  contractForm: Contract = {
    id: '',
    clientName: '',
    startDate: '',
    endDate: '',
    space: 0,
    status: 'Activo'
  };  

  constructor(private contractService: ContractService, private userService: UserService, private spaceService: SpaceService) {}

  ngOnInit() {
    this.loadContracts();
  }

  async saveContract() {
    if (this.isEditing) {
      await this.contractService.updateContract(this.contractForm.id.toString(), this.contractForm);
      this.message = 'Contrato actualizado exitosamente';
        setTimeout(() => (this.message = null), 3000);
    } else {
      if (this.selectedClientName !== '' || this.selectedSpaceNum !== 0) {
        await this.userService.updateUser(this.idUser, {state: 'Contrato'}); // Cambiar el estado del cliente a contrato      
        await this.spaceService.updateSpace(this.idSpace, {status: 'Ocupado'}); // Cambiar el estado del espacio a ocupado      
        await this.contractService.addContract(this.contractForm);      
        this.message = 'Contrato registrado exitosamente';
        setTimeout(() => (this.message = null), 3000);
      } else {
        this.message = 'Por favor complete todos los campos necesarios!';
        setTimeout(() => (this.message = null), 3000);
      }      
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

  resetForm() {
    this.contractForm = {
      id: '',
      clientName: '',
      startDate: '',
      endDate: '',
      space: 0,
      status: 'Activo'
    };
  }

  loadContracts() {
    this.contractService.getSpaces().then(contracts => {
      this.contracts = contracts;
    });
  }

  cancelEdit() {
    this.resetForm();
    this.isEditing = false;
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

  openClientModal() {
    this.isClientModalOpen = true;
    this.userService.getUsers().then(users => {
      this.clients = users
    })
  }

  closeClientModal() {
    this.isClientModalOpen = false;
  }

  selectClient(user: User) {
    this.selectedClientName = user.name;
    if(user.id !== undefined ) {
      this.idUser = user.id
    } else {
      console.error('El ID del usuario es undefined');
    } 
    this.contractForm.clientName = user.name;    
    this.closeClientModal();  // Cerrar el modal
  }




  //Metodos para seleccionar el espacio
  openSpaceModal() {    
    this.isSpaceModalOpen = true;    
    this.spaceService.getSpaces().then(spaces => {   
        
      this.spaces = spaces      
    })
  }

  closeSpaceModal() {
    this.isSpaceModalOpen = false;
  }

  selectSpace(space: Space) {
    this.selectedSpaceNum = space.number
    if(space.id !== undefined ) {
      this.idSpace = space.id
    } else {
      console.error('El ID del espacio es undefined');
    }    
    this.contractForm.space = space.number
    this.closeSpaceModal()
  }

}
