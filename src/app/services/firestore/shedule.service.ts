import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { Schedule } from '../../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class SheduleService {

  private firestore: Firestore = inject(Firestore); // Inyección de Firestore

  constructor() { }

  // Método para agregar un nuevo horario
  async addHorario(horario: Schedule): Promise<void> {
    const horariosCollection = collection(this.firestore, 'horarios'); // Referencia a la colección 'horarios'
    return addDoc(horariosCollection, horario).then((docRef)=> {
      // Asignar el ID generado por Firebase al espacio
      return updateDoc(docRef, { id: docRef.id });
    });
  }
      
  // Método para actualizar un horario existente
  async updateHorario(horario: Schedule): Promise<void> {
    if (!horario.id) {
      throw new Error('El horario no tiene un id válido');
    }

    const horarioRef = doc(this.firestore, 'horarios', horario.id); // Obtiene la referencia del documento
    await updateDoc(horarioRef, { 
      day: horario.day, 
      start: horario.start, 
      end: horario.end 
    });
  }

  // Eliminar un horario
  deleteHorario(id: string): Promise<void> {
    const horarioRef = doc(this.firestore, 'horarios', id); // Referencia al documento que se va a eliminar
    return deleteDoc(horarioRef); // Elimina el documento de Firestore
  }
  async getSchedules() {
    const scheduleCollection = collection(this.firestore, 'horarios');
    const snapshot = await getDocs(scheduleCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Schedule[];
  }


  
}
