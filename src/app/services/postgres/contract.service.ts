import { Injectable } from '@angular/core';
import { environment } from '../../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contract } from '../../models/contract.model';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private apiUrl = `${environment.apiUrl}/contract`;

  constructor(private http: HttpClient) {}


  registerContract(contract: Contract): Observable<any> {
      const token = localStorage.getItem('token');
      //console.log("Token: "+token);
      if (!token) {
        console.error('🚨 No hay token guardado en localStorage');
        return throwError(() => new Error('Token no encontrado'));
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.apiUrl}/create`, contract, { headers });
    }
  
    getContracts(): Observable<Contract[]> {
      const token = localStorage.getItem('token');
      //console.log("Token: "+token);
      if (!token) {
        console.error('🚨 No hay token guardado en localStorage');
        return throwError(() => new Error('Token no encontrado'));
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Contract[]>(`${this.apiUrl}/contract`,{ headers });
    }
  
    updateContract(space: Contract) {
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
