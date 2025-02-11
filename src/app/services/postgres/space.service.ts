import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Vehicle } from '../../models/vehicle.model';
import { Space } from '../../models/space.model';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  private apiUrl = 'http://localhost:8080/parking_projects_backend-1.0-SNAPSHOT/rs/space';

  constructor(private http: HttpClient) {}

  registerSpace(space: Space): Observable<any> {
    console.log('Datos del formulario:', space);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    });
    return this.http.post(this.apiUrl, space, {headers});
  }

  getSpaces(): Observable<Space[]> {
    return this.http.get<Space[]>(this.apiUrl);
  }

  
}
