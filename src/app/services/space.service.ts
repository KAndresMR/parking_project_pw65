import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
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

  // Método para reservar un espacio
  async reserveSpace(spaceId: string): Promise<void> {
    try {
      // Obtiene la referencia al documento del espacio
      const spaceRef = doc(this.firestore, 'spaces', spaceId);

      // Actualiza el estado del espacio a "reservado" (puedes añadir más campos según tu modelo)
      await updateDoc(spaceRef, {
        status: 'Ocupado',  // Asegúrate de tener un campo "status" en tu modelo de datos
        reservedAt: new Date()  // Se puede añadir la fecha en que fue reservado
      });
    } catch (error) {
      console.error("Error al reservar el espacio: ", error);
      throw new Error('Error al reservar el espacio');
    }
  }

   // Método para obtener solo los espacios disponibles
   async getAvailableSpaces(): Promise<Space[]> {
    const spacesCollection = collection(this.firestore, 'spaces');
    const availableSpacesQuery = query(spacesCollection, where('status', '==', 'Disponible')); // Filtro por estado
    const snapshot = await getDocs(availableSpacesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Space[];
  }

}
