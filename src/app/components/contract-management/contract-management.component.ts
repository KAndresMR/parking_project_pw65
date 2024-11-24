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
export class ContractManagementComponent implements OnInit {
  // Tarifas por tipo de espacio
  tarifasPorTipo: { [key: string]: number } = {
    VIP: 50,
    Discapacitados: 40,
    Cubierto: 30,
    Descubierto: 20,
    Normal: 15,
  };

  // Lista de contratos cargados
  contracts: Contract[] = [];
  // Lista de usuarios (clientes)
  clients: User[] = [];
  // Lista de espacios disponibles
  spaces: Space[] = [];
  // Mensaje para notificar al usuario sobre operaciones realizadas
  message: string | null = null;
  // Estados de los modales para seleccionar clientes y espacios
  isClientModalOpen: boolean = false;
  isSpaceModalOpen: boolean = false;
  // Bandera para determinar si se está editando un contrato
  isEditing = false;
  // Parámetros para búsqueda y filtrado
  searchText: string = '';
  filterStatus: string = '';
  // Datos seleccionados en los modales
  selectedClientName: string = '';
  selectedSpaceNum: number = 0;
  // IDs de cliente y espacio seleccionados
  idSpace: string = '';
  idUser: string = '';
  // Costo estimado del contrato
  estimatedCost: number = 0;
  // Variable auxiliar para almacenar el tipo de espacio
  var1: string = '';

  // Modelo del formulario de contrato
  contractForm: Contract = {
    id: '',
    clientName: '',
    startDate: '',
    endDate: '',
    space: 0,
    status: 'Activo',
    cost: 0
  };

  constructor(
    private contractService: ContractService,
    private userService: UserService,
    private spaceService: SpaceService
  ) {}

  ngOnInit() {
    // Cargar los contratos al inicializar el componente
    this.loadContracts();
  }

  // Guardar o actualizar un contrato
  async saveContract() {
    this.calculateCost();
    this.contractForm.cost = this.estimatedCost;

    if (this.isEditing) {
      // Actualizar contrato existente
      await this.contractService.updateContract(this.contractForm.id.toString(), this.contractForm);
      this.message = 'Contrato actualizado exitosamente';
    } else {
      // Registrar un nuevo contrato
      if (this.selectedClientName && this.selectedSpaceNum) {
        await this.contractService.addContract(this.contractForm, this.idUser, this.idSpace);
        this.message = 'Contrato registrado exitosamente';
      } else {
        this.message = 'Por favor complete todos los campos necesarios!';
      }
    }
    setTimeout(() => (this.message = null), 3000);
    this.resetForm();
    this.loadContracts();
  }

  // Activar modo edición para un contrato
  editContract(contract: Contract) {
    this.contractForm = { ...contract };
    this.isEditing = true;
  }

  // Eliminar un contrato
  async deleteContract(contract: Contract) {
    if (!contract.id) return;

    try {
      await this.contractService.deleteContract(contract);
      alert('Contrato eliminado correctamente');
      this.loadContracts();
    } catch (error) {
      console.error('Error al eliminar el contrato:', error);
      alert('Hubo un problema al intentar eliminar el contrato.');
    }
  }

  // Restablecer el formulario de contrato
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
    this.isEditing = false;
  }

  // Cargar todos los contratos desde el servicio
  loadContracts() {
    this.contractService.getSpaces().then(contracts => {
      this.contracts = contracts;
    });
  }

  // Cancelar edición de contrato
  cancelEdit() {
    this.resetForm();
  }

  // Obtener contratos filtrados por búsqueda y estado
  get filteredContracts(): Contract[] {
    return this.contracts.filter(contract => {
      const matchesSearchText = this.searchText
        ? contract.clientName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          contract.id.toString().includes(this.searchText)
        : true;

      const matchesStatus = this.filterStatus
        ? contract.status.toLowerCase() === this.filterStatus.toLowerCase()
        : true;

      return matchesSearchText && matchesStatus;
    });
  }

  // Abrir el modal para seleccionar un cliente
  openClientModal() {
    this.isClientModalOpen = true;
    this.userService.getUsers().then(users => {
      this.clients = users;
    });
  }

  // Cerrar el modal de cliente
  closeClientModal() {
    this.isClientModalOpen = false;
  }

  // Seleccionar un cliente del modal
  selectClient(user: User) {
    this.selectedClientName = user.name;
    this.idUser = user.id || '';
    this.contractForm.clientName = user.name;
    this.closeClientModal();
  }

  // Abrir el modal para seleccionar un espacio
  openSpaceModal() {
    this.isSpaceModalOpen = true;
    this.spaceService.getSpaces().then(spaces => {
      this.spaces = spaces;
    });
  }

  // Cerrar el modal de espacio
  closeSpaceModal() {
    this.isSpaceModalOpen = false;
  }

  // Seleccionar un espacio del modal
  selectSpace(space: Space) {
    this.selectedSpaceNum = space.number;
    this.idSpace = space.id || '';
    this.var1 = space.type;
    this.contractForm.space = space.number;
    this.calculateCost();
    this.closeSpaceModal();
  }

  // Calcular la cantidad de días entre dos fechas
  calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return 0;
    }
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((end.getTime() - start.getTime()) / millisecondsPerDay);
  }

  // Calcular el costo total del contrato
  calculateCost() {
    const spaceType = this.spaces.find(space => space.number === this.selectedSpaceNum)?.type;
    if (!spaceType) {
      console.error('No se pudo determinar el tipo de espacio.');
      this.estimatedCost = 0;
      return;
    }

    const tarifaDiaria = this.tarifasPorTipo[spaceType] || 0;
    const days = this.calculateDays(this.contractForm.startDate, this.contractForm.endDate);

    if (days > 0) {
      this.estimatedCost = tarifaDiaria * days;
    } else {
      this.estimatedCost = 0;
    }
  }
}
