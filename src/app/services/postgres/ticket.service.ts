import { Injectable } from '@angular/core';
import { environment } from '../../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ticket } from '../../models/ticket.model';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = `${environment.apiUrl}/ticket`;

  constructor(private http: HttpClient) { }

  registerTicket(ticket: Ticket): Observable<any> {
      //console.log("Llegada de datos: "+ticket);
      const token = localStorage.getItem('token');
          if (!token) {
            console.error('🚨 No hay token guardado en localStorage');
            return throwError(() => new Error('Token no encontrado'));
          }
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.apiUrl}/create`, ticket, { headers });
    }
  
    getTickets(): Observable<Ticket[]> {
        const token = localStorage.getItem('token');
        //console.log("Token: "+token);
        if (!token) {
          console.error('🚨 No hay token guardado en localStorage');
          return throwError(() => new Error('Token no encontrado'));
        }
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`,{ headers });
      }
}
