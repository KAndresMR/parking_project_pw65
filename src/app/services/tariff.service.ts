import { Injectable } from '@angular/core';
import { Tariff } from '../models/tariff.model';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TariffService {
  
  private tariffsCollection;

  constructor(private firestore:Firestore) { 
    this.tariffsCollection = collection(this.firestore, 'tariffs');
  }

  

  async getTariffs() {
    const spacesCollection = collection(this.firestore, 'tariff');
    const snapshot = await getDocs(spacesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tariff[];
  }

  addTariff(tariff: Tariff): Promise<void> {

    const tariffCollection = collection(this.firestore, 'tariff');
    return addDoc(tariffCollection, tariff).then((docRef)=> {
      // Asignar el ID generado por Firebase al espacio
      return updateDoc(docRef, { id: docRef.id });
    });


    const tariffDoc = doc(this.tariffsCollection, tariff.id);
    return updateDoc(tariffDoc, { ...tariff });
  }

  updateTariff(tariff: Tariff): Promise<void> {
    const tariffDoc = doc(this.tariffsCollection, tariff.id);
    return updateDoc(tariffDoc, { ...tariff });
  }

  deleteTariff(id: string) {
    const tariffDoc = doc(this.firestore, `tariff/${id}`);
    return deleteDoc(tariffDoc);
  }


}
