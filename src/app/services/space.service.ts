import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Space } from '../models/space.model';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {  

  constructor(private firestore: Firestore) {}

  /**
   * Método para agregar un nuevo espacio.
   * @param space El objeto Space que representa el nuevo espacio a agregar.
   * @returns Una promesa que se resuelve cuando el espacio es agregado exitosamente.
   */
  addSpace(space: Space): Promise<void> {
    const spacesCollection = collection(this.firestore, 'spaces'); // Referencia a la colección de espacios
    return addDoc(spacesCollection, space).then((docRef) => {
      // Asignar el ID generado por Firebase al espacio
      return updateDoc(docRef, { id: docRef.id });
    });
  }
  
  /**
   * Método para obtener todos los espacios.
   * @returns Una promesa que se resuelve con una lista de todos los espacios.
   */
  async getSpaces() {
    const spacesCollection = collection(this.firestore, 'spaces'); // Referencia a la colección de espacios
    const snapshot = await getDocs(spacesCollection); // Obtiene los documentos de la colección
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Space[]; // Mapea los documentos a objetos de tipo Space
  }

  /**
   * Método para actualizar un espacio.
   * @param id El ID del espacio a actualizar.
   * @param space Los datos actualizados del espacio.
   * @returns Una promesa que se resuelve cuando el espacio es actualizado exitosamente.
   */
  updateSpace(id: string, space: Partial<Space>) {
    const spaceDoc = doc(this.firestore, `spaces/${id}`); // Referencia al documento del espacio
    return updateDoc(spaceDoc, space); // Actualiza los datos del espacio
  }

  /**
   * Método para eliminar un espacio.
   * @param id El ID del espacio a eliminar.
   * @returns Una promesa que se resuelve cuando el espacio es eliminado exitosamente.
   */
  deleteSpace(id: string) {
    const spaceDoc = doc(this.firestore, `spaces/${id}`); // Referencia al documento del espacio
    return deleteDoc(spaceDoc); // Elimina el documento del espacio
  }

  /**
   * Método para reservar un espacio.
   * @param spaceId El ID del espacio a reservar.
   * @returns Una promesa que se resuelve cuando el espacio es reservado exitosamente.
   */
  async reserveSpace(spaceId: string): Promise<void> {
    try {
      const spaceRef = doc(this.firestore, 'spaces', spaceId); // Obtiene la referencia al documento del espacio
      // Actualiza el estado del espacio a "Ocupado" y añade la fecha de reserva
      await updateDoc(spaceRef, {
        status: 'Ocupado', // Campo de estado actualizado a "Ocupado"
        reservedAt: new Date() // Añade la fecha de reserva
      });
    } catch (error) {
      console.error("Error al reservar el espacio: ", error);
      throw new Error('Error al reservar el espacio'); // Lanza un error en caso de fallo
    }
  }

  /**
   * Método para obtener solo los espacios disponibles.
   * @returns Una promesa que se resuelve con una lista de espacios disponibles.
   */
  async getAvailableSpaces(): Promise<Space[]> {
    const spacesCollection = collection(this.firestore, 'spaces'); // Referencia a la colección de espacios
    const availableSpacesQuery = query(spacesCollection, where('status', '==', 'Disponible')); // Filtro para obtener solo los espacios disponibles
    const snapshot = await getDocs(availableSpacesQuery); // Obtiene los documentos de los espacios disponibles
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Space[]; // Mapea los documentos a objetos de tipo Space
  }

}
