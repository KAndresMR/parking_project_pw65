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
  
  tarifasPorTipo: { [key: string]: number } = {
    VIP: 50,
    Discapacitados: 40,
    Cubierto: 30,
    Descubierto: 20,
    Normal: 15,
  };

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
  estimatedCost: number = 0; // Nuevo: Para almacenar el costo calculado
  var1: string = ''

  contractForm: Contract = {
    id: '',
    clientName: '',
    startDate: '',
    endDate: '',
    space: 0,
    status: 'Activo',
    cost: 0
  };  

  constructor(private contractService: ContractService, private userService: UserService, private spaceService: SpaceService) {}

  ngOnInit() {
    this.loadContracts();
  }

  async saveContract() {
    this.calculateCost()
    this.contractForm.cost = this.estimatedCost;
    const newContract: Contract = {
      ...this.contractForm,
      cost: this.estimatedCost, // Asignar el costo calculado
    };


    if (this.isEditing) {
      await this.contractService.updateContract(this.contractForm.id.toString(), this.contractForm);
      this.message = 'Contrato actualizado exitosamente';
        setTimeout(() => (this.message = null), 3000);
    } else {
      if (this.selectedClientName !== '' || this.selectedSpaceNum !== 0) {
        console.log("Id el user: "+this.idUser)
        console.log("Id el space: "+this.idSpace)

        await this.contractService.addContract(this.contractForm, this.idUser, this.idSpace);      
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
    try {
      await this.contractService.deleteContract(contract);
    alert('Contrato eliminado correctamente');
    this.loadContracts(); // Recargar los contratos      
    } catch (error) {
      console.error('Error al eliminar el contrato:', error);
      alert('Hubo un problema al intentar eliminar el contrato.');
    }            
  }  

  resetForm() {
    this.contractForm = {
      id: '',
      clientName: '',
      startDate: '',
      endDate: '',
      space: 0,
      status: 'Activo',
      cost: 0
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

  //Filtrado y busqueda de contratos
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

  //Metodos para seleccionar el usuario
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
    this.calculateCost();
    this.var1 = space.type    
    this.contractForm.space = space.number
    this.closeSpaceModal()
  }


  
  //Funcion para calcular dias
  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (end < start) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return 0; // Evitar cálculos erróneos
    }
  
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil((end.getTime() - start.getTime()) / millisecondsPerDay);
  
    return days;
  }

  

  //Funcion para calcular el costo total
  calculateCost() {
    
    // Obtén el tipo de espacio seleccionado
    const spaceType = this.spaces.find(space => space.number === this.selectedSpaceNum)?.type;

    if (!spaceType) {
      console.error('No se pudo determinar el tipo de espacio.');
      this.estimatedCost = 0;
      return;
    }

    // Obtén la tarifa diaria según el tipo de espacio
    const tarifaDiaria = this.tarifasPorTipo[spaceType] || 0;

    // Calcula el número de días entre las fechas seleccionadas
    const startDate = new Date(this.contractForm.startDate);
    const endDate = new Date(this.contractForm.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Fechas inválidas.');
      this.estimatedCost = 0;
      return;
    }

    const diferenciaDias = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diferenciaDias <= 0) {
      console.error('La fecha de finalización debe ser posterior a la fecha de inicio.');
      this.estimatedCost = 0;
      return;
    }

    // Calcula el costo total
    this.estimatedCost = tarifaDiaria * diferenciaDias;
    console.log(`Tipo de espacio: ${spaceType}, Tarifa diaria: ${tarifaDiaria}, Días: ${diferenciaDias}, Costo total: ${this.estimatedCost}`);

  }
  
}
