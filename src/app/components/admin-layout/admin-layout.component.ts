import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../services/firestore/authentication.service';
import { from, ObservableInput } from 'rxjs';

@Component({
  selector: 'app-admin-layout', 
  standalone: true, 
  imports: [RouterOutlet], 
  templateUrl: './admin-layout.component.html', 
  styleUrl: './admin-layout.component.scss' 
})
export class AdminLayoutComponent implements OnInit {
  // Variables para almacenar la información del usuario actual
  userEmail: string | undefined; // Almacena el correo del usuario
  userName: string | undefined; // Almacena el nombre del usuario

  // Constructor: inyecta servicios necesarios
  constructor(private router: Router, private authService: AuthenticationService) {}

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Obtiene los datos del usuario actual a través del servicio de autenticación.
   */
  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        // Asigna los valores del usuario a las variables locales
        this.userEmail = user.email ?? 'Correo no disponible'; // Usa 'Correo no disponible' si el email es null o undefined
        this.userName = user.name ?? 'Usuario'; // Usa 'Usuario' si el nombre es null o undefined
      }
    });
  }

  /**
   * Navega a una ruta específica dentro de la sección de administración.
   * @param route - Nombre de la ruta a la que se desea navegar
   */
  goTo(route: string) {
    this.router.navigate([`/admin/${route}`]);
  }

  /**
   * Método para cerrar sesión y redirigir al usuario a la página de login.
   */
  logout() {
    this.router.navigate(['/login']);
  }
}
