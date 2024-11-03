import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private firestore: Firestore) {}

  getUserProfile(uid: string): Observable<any> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDoc)).pipe(map(doc => doc.data()));
  }

  updateUserProfile(uid: string, updatedData: any): Promise<void> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return updateDoc(userDoc, updatedData);
  }

  

}
