import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Asumiendo que guardas el rol en el localStorage
  
  if (!token) {
    console.warn('🚨 No hay token, redirigiendo al login...');
    router.navigate(['/login']);
    return false;
  }

  // Verificar si la ruta requiere permisos de administrador
  const isAdminRoute = state.url.startsWith('/admin');
  
  if (isAdminRoute && userRole !== 'administrador') {
    console.warn('🚨 Acceso denegado. Se necesita el rol de administrador.');
    router.navigate(['/profile']); // Redirigir a la página del cliente
    return false;
  }
  return true;
  
};
