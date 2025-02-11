import { Injectable } from '@angular/core';
import { Contract } from '../../models/contract.model';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where, writeBatch } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private firestore: Firestore) {}

  /**
   * Método para agregar un nuevo contrato y actualizar las entidades relacionadas (usuario y espacio).
   * @param contract Objeto de tipo Contract con los datos del contrato.
   * @param userId ID del usuario relacionado con el contrato.
   * @param spaceId ID del espacio relacionado con el contrato.
   */
  async addContract(contract: Contract, userId: string, spaceId: string): Promise<void> {
    const batch = writeBatch(this.firestore); // Inicia un lote de operaciones

    try {
      // 1. Añadir el contrato
      const contractRef = doc(collection(this.firestore, 'contracts'));
      batch.set(contractRef, { ...contract, id: contractRef.id });

      // 2. Actualizar el estado del cliente
      const userRef = doc(this.firestore, `users/${userId}`);
      batch.update(userRef, { state: 'Activo' });

      // 3. Actualizar el estado del espacio
      const spaceRef = doc(this.firestore, `spaces/${spaceId}`);
      batch.update(spaceRef, { status: 'Ocupado' });

      // 4. Ejecutar las operaciones en lote
      await batch.commit();
      console.log('Contrato creado y entidades relacionadas actualizadas');
    } catch (error) {
      console.error('Error al crear contrato y actualizar datos relacionados:', error);
      throw error; // Lanza el error para ser manejado en un nivel superior
    }
  }

  /**
   * Método para obtener todos los contratos.
   * @returns Una lista de contratos.
   */
  async getSpaces() {
    const spacesCollection = collection(this.firestore, 'contracts'); // Obtiene la colección de contratos
    const snapshot = await getDocs(spacesCollection); // Obtiene los documentos de la colección
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Contract[]; // Mapea los documentos a objetos Contract
  }

  /**
   * Método para actualizar un contrato existente.
   * @param id ID del contrato a actualizar.
   * @param contract Objeto con los datos actualizados del contrato.
   */
  async updateContract(id: string, contract: Partial<Contract>) {
    const contractDoc = doc(this.firestore, `contracts/${id}`); // Referencia al documento del contrato
    return updateDoc(contractDoc, contract); // Actualiza el documento con los datos proporcionados
  }

  /**
   * Método para eliminar un contrato y actualizar las entidades relacionadas (usuario y espacio).
   * @param contract Objeto Contract que representa el contrato a eliminar.
   */
  async deleteContract(contract: Contract): Promise<void> {
    const batch = writeBatch(this.firestore); // Inicia un lote de operaciones

    try {
      // 1. Eliminar el contrato
      const contractRef = doc(this.firestore, `contracts/${contract.id}`);
      batch.delete(contractRef);

      // 2. Actualizar el estado del cliente
      if (contract.clientName) {
        const userQuery = query(
          collection(this.firestore, 'users'),
          where('name', '==', contract.clientName)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userRef = doc(this.firestore, `users/${userDoc.id}`);
          batch.update(userRef, { state: 'Inactivo' }); // Actualiza el estado del usuario a 'Inactivo'
        }
      }

      // 3. Actualizar el estado del espacio
      const spaceQuery = query(
        collection(this.firestore, 'spaces'),
        where('number', '==', contract.space)
      );
      const spaceSnapshot = await getDocs(spaceQuery);

      if (!spaceSnapshot.empty) {
        const spaceDoc = spaceSnapshot.docs[0];
        const spaceRef = doc(this.firestore, `spaces/${spaceDoc.id}`);
        batch.update(spaceRef, { status: 'Disponible' }); // Actualiza el estado del espacio a 'Disponible'
      }

      // 4. Ejecutar las operaciones en lote
      await batch.commit();
      console.log('Contrato eliminado y entidades relacionadas actualizadas');
    } catch (error) {
      console.error('Error al eliminar contrato y actualizar datos relacionados:', error);
      throw error; // Lanza el error para ser manejado en un nivel superior
    }
  }
}
