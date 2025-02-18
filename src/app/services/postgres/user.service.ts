import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/parking_projects_backend-1.0-SNAPSHOT/rs/user';

  constructor(private http: HttpClient) { }

  registerUser(user: User): Observable<any> {
    //console.log("Llegada de datos: " + user);
    return this.http.post(`${this.apiUrl}/create`, user);
  }

  getUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('🚨 No hay token guardado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User[]>(`${this.apiUrl}/users`,{ headers });
  }

  updateUser(user: User) {
    //console.log("Llegada de datos: ", user);
    return this.http.put(`${this.apiUrl}/${user.id}`, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);  // Guardamos el rol
      }),
      catchError(error => {
        console.error('Error en el login:', error);
        return throwError(() => new Error('Credenciales inválidas'));
      })
    );
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Si hay token, está autenticado
  }

  logout() {
    console.log("Token en localStoraga: "+ localStorage.length);
    localStorage.removeItem('token');
    console.log("Token removido: "+ localStorage.length);
  }

  // Método para hacer peticiones con autenticación
  getSecureData(): Observable<any> {
    const token = this.getToken(); // Obtén el token desde el localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Agrega el token al header

    return this.http.get(`${this.apiUrl}/secure/data`, { headers }); // Llama al endpoint protegido
  }

}
