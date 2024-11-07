import { Injectable } from '@angular/core';
import { Contract } from '../models/contract.model';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private firestore: Firestore) {}

  async addContract(contract: Contract): Promise<void> {
    const contractsCollection = collection(this.firestore, 'contracts');
    return addDoc(contractsCollection, contract).then((docRef)=> {
      // Asignar el ID generado por Firebase al espacio
      return updateDoc(docRef, { id: docRef.id });
    });
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

  async deleteContract(id: string) {
    const contractDoc = doc(this.firestore, `contracts/${id}`);
    return deleteDoc(contractDoc);
  }
}
