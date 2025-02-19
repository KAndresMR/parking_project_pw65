import { Injectable } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = `${environment.apiUrl}/vehicle`;

  constructor(private http: HttpClient) { }

  registerVehicle(vehicle: Vehicle): Observable<any> {
    console.log("Servico de angular: ", vehicle);
    console.log("Servico de angular: ", vehicle.space);
    console.log("Servico de angular: ", vehicle.user);
    const token = localStorage.getItem('token');
        if (!token) {
          console.error('🚨 No hay token guardado en localStorage');
          return throwError(() => new Error('Token no encontrado'));
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/create`, vehicle, { headers });
  }

  getVehicles(): Observable<Vehicle[]> {
      const token = localStorage.getItem('token');
      //console.log("Token: "+token);
      if (!token) {
        console.error('🚨 No hay token guardado en localStorage');
        return throwError(() => new Error('Token no encontrado'));
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles`,{ headers });
    }

}
