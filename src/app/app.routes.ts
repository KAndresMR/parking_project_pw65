import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SpaceManagementComponent } from './components/space-management/space-management.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { ContractManagementComponent } from './components/contract-management/contract-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { WorkScheduleComponent } from './components/work-schedule/work-schedule.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/Dashboard_customer/profile/profile.component';
import { NgModule } from '@angular/core';
import { HistoryComponent } from './components/history/history.component';
import { authGuard } from './guards/auth.guard';
import { VehicleManagementComponent } from './components/vehicle-management/vehicle-management.component';
import { TicketManagementComponent } from './components/ticket-management/ticket-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },   // Ruta para el login
  { path: 'register', component: RegisterComponent },   // Ruta para el registro

  // Ruta protegida para clientes
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  // Rutas protegidas para administradores
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: 'space', component: SpaceManagementComponent },
      { path: 'contract', component: ContractManagementComponent },
      { path: 'user', component: UserManagementComponent },
      { path: 'schedule', component: WorkScheduleComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'vehicle', component: VehicleManagementComponent },
      { path: 'ticket', component: TicketManagementComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }  // Redirección por defecto al Dashboard
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }