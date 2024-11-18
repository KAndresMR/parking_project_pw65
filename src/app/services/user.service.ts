import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) { }

  async addUsers(user: User): Promise<void> {
    const usersCollection = collection(this.firestore, 'users');
    return addDoc(usersCollection, user).then((docRef)=> {
      // Asignar el ID generado por Firebase al espacio
      return updateDoc(docRef, { id: docRef.id });
    });
  }

  async getUsers() {
    const spacesCollection = collection(this.firestore, 'users');
    const snapshot = await getDocs(spacesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
  }

  async updateUser(id: string, user: Partial<User>) {
    const userDoc = doc(this.firestore, `users/${id}`);
    return updateDoc(userDoc, user);
  }

  async deleteUser(id: string) {
    const userDoc = doc(this.firestore, `users/${id}`);
    return deleteDoc(userDoc);
  }


}
