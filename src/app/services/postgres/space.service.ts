import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';
import { Space } from '../../models/space.model';
import { environment } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  private apiUrl = `${environment.apiUrl}/space`;

  constructor(private http: HttpClient) {}

  registerSpace(space: Space): Observable<any> {
    const token = localStorage.getItem('token');
    //console.log("Token: "+token);
    if (!token) {
      console.error('🚨 No hay token guardado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/create`, space, { headers });
  }

  getSpaces(): Observable<Space[]> {
    const token = localStorage.getItem('token');
    //console.log("Token: "+token);
    if (!token) {
      console.error('🚨 No hay token guardado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Space[]>(`${this.apiUrl}/spaces`,{ headers });
  }

  updateSpace(space: Space) {
    const token = localStorage.getItem('token');
    //console.log("Token: "+token);
    if (!token) {
      console.error('🚨 No hay token guardado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    //console.log("Llegada de datos: ", space);
    return this.http.put(`${this.apiUrl}/${space.id}`, space, { headers });
  }

  
}
