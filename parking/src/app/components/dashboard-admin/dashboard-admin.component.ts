import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent {

  adminName: string = 'Andres Morocho'
  occupiedSpaces: number = 10
  registeredUsers: number = 20
  activeContracts: number = 30


  logout() {

  }

  goTo(space:string) {

  }

  createContract() {

  }

  addSpace() {

  }
  
  manageUsers() {

  }

}
