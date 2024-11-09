import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { from, ObservableInput } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit{
  userEmail: string | undefined;
  userName: string | undefined;

  constructor(private router: Router, private authService: AuthenticationService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userEmail = user.email ?? 'Correo no disponible';
        this.userName = user.name ?? 'Usuario';
      }
    });
  }

  goTo(route: string) {
    this.router.navigate([`/admin/${route}`]);
  }

  // Método para cerrar sesión y redirigir al login
  logout() {
    this.authService.logoutt().subscribe(() => {
      // Una vez que se haya cerrado sesión, redirige al login
      this.router.navigate(['/login']);
    });
  }

}
