import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { Space } from '../models/space.model';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {  

  constructor(private firestore: Firestore) {}

  addSpace(space: Space): Promise<void> {
    const spacesCollection = collection(this.firestore, 'spaces');
    return addDoc(spacesCollection, space).then((docRef)=> {
      // Asignar el ID generado por Firebase al espacio
      return updateDoc(docRef, { id: docRef.id });
    });
  }
  
  async getSpaces() {
    const spacesCollection = collection(this.firestore, 'spaces');
    const snapshot = await getDocs(spacesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Space[];
  }

  updateSpace(id: string, space: Partial<Space>) {
    const spaceDoc = doc(this.firestore, `spaces/${id}`);
    return updateDoc(spaceDoc, space);
  }

  deleteSpace(id: string) {
    const spaceDoc = doc(this.firestore, `spaces/${id}`);
    return deleteDoc(spaceDoc);
  }


}
