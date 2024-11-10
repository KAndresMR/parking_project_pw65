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

  getOccupiedSpaces(): Observable<number> {
    const spacesRef = collection(this.firestore, 'spaces');
    const occupiedQuery = query(spacesRef, where('status', '==', 'Ocupado'));
    return collectionData(occupiedQuery).pipe(
      map((data) => (data as Space[]).length) // Conversión explícita a Space[]
    );
  }

  getRegisteredUsers(): Observable<number> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef).pipe(
      map((data) => (data as User[]).length) // Conversión explícita a User[]
    );
  }

  getActiveContracts(): Observable<number> {
    const contractsRef = collection(this.firestore, 'contracts');
    const activeQuery = query(contractsRef, where('status', '==', 'Activo'));
    return collectionData(activeQuery).pipe(
      map((data) => (data as Contract[]).length) // Conversión explícita a Contract[]
    );
  }
}
