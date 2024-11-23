import { Injectable } from '@angular/core';
import { Contract } from '../models/contract.model';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where, writeBatch } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private firestore: Firestore) {}

  async addContract(contract: Contract, userId: string, spaceId: string): Promise<void> {
    const batch = writeBatch(this.firestore);

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
      throw error;
    }
  }

  async getSpaces() {
    const spacesCollection = collection(this.firestore, 'contracts');
    const snapshot = await getDocs(spacesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Contract[];
  }

  async updateContract(id: string, contract: Partial<Contract>) {
    const contractDoc = doc(this.firestore, `contracts/${id}`);
    return updateDoc(contractDoc, contract);
  }

  async deleteContract(contract: Contract): Promise <void> {
    const batch = writeBatch(this.firestore)

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
          batch.update(userRef, { state: 'Inactivo' });
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
        batch.update(spaceRef, { status: 'Disponible' });
      }
  
      // 4. Ejecutar las operaciones en lote
      await batch.commit();
      console.log('Contrato eliminado y entidades relacionadas actualizadas');
    } catch (error) {
      console.error('Error al eliminar contrato y actualizar datos relacionados:', error);
      throw error;
    }

  }
}
