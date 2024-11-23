import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private firestore: Firestore) {}

  getUserProfile(id: string): Observable<any> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return from(getDoc(userDoc)).pipe(map(doc => doc.data()));
  }

  updateUserProfile(id: string, updatedData: any): Promise<void> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return updateDoc(userDoc, updatedData);
  }

  

}
