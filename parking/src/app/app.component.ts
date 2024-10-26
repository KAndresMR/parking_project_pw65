import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardAdminComponent } from "./components/dashboard-admin/dashboard-admin.component";
import { SpaceManagementComponent } from "./components/space-management/space-management.component";
import { AdminLayoutComponent } from "./components/admin-layout/admin-layout.component";

@Component({
  selector: 'app-root',
  standalone: true,  
  imports: [RouterOutlet, LoginComponent, DashboardAdminComponent, SpaceManagementComponent, AdminLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'parking';
}
