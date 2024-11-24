import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { Contract } from '../models/contract.model';
import { Space } from '../models/space.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private firestore: Firestore) { }

  /**
   * Método para obtener el número de espacios ocupados.
   * @returns Un observable que emite el número de espacios ocupados.
   */
  getOccupiedSpaces(): Observable<number> {
    const spacesRef = collection(this.firestore, 'spaces'); // Referencia a la colección de espacios
    const occupiedQuery = query(spacesRef, where('status', '==', 'Ocupado')); // Consulta para obtener espacios con estado 'Ocupado'
    return collectionData(occupiedQuery).pipe(
      map((data) => (data as Space[]).length) // Convierte los datos a tipo Space[] y devuelve la longitud (número de espacios ocupados)
    );
  }

  /**
   * Método para obtener el número total de usuarios registrados.
   * @returns Un observable que emite el número de usuarios registrados.
   */
  getRegisteredUsers(): Observable<number> {
    const usersRef = collection(this.firestore, 'users'); // Referencia a la colección de usuarios
    return collectionData(usersRef).pipe(
      map((data) => (data as User[]).length) // Convierte los datos a tipo User[] y devuelve la longitud (número de usuarios registrados)
    );
  }

  /**
   * Método para obtener el número de contratos activos.
   * @returns Un observable que emite el número de contratos activos.
   */
  getActiveContracts(): Observable<number> {
    const contractsRef = collection(this.firestore, 'contracts'); // Referencia a la colección de contratos
    const activeQuery = query(contractsRef, where('status', '==', 'Activo')); // Consulta para obtener contratos con estado 'Activo'
    return collectionData(activeQuery).pipe(
      map((data) => (data as Contract[]).length) // Convierte los datos a tipo Contract[] y devuelve la longitud (número de contratos activos)
    );
  }
}
