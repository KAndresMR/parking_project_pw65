import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Schedule } from '../../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleworkService {

  private apiUrl = 'http://localhost:8080/parking_projects_backend-1.0-SNAPSHOT/rs/schedulework';

  constructor(private http: HttpClient) { }

  registerSchedule(schedule: Schedule): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, schedule);
  }

  getSchedule(): Observable<Schedule[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('🚨 No hay token guardado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Schedule[]>(`${this.apiUrl}/schedules`, { headers });
  }

  updateSchedule(schedule: Schedule) {
    //console.log("Llegada de datos: ", schedule);
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('🚨 No hay token guardado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${schedule.id}`, schedule, { headers });
  }
}
