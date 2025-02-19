import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/user`;

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
    const token = localStorage.getItem('token');
        //console.log("Token: "+token);
        if (!token) {
          console.error('🚨 No hay token guardado en localStorage');
          return throwError(() => new Error('Token no encontrado'));
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${user.id}`, user, { headers });
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

}
