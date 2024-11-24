import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  /**
   * Constructor del servicio ProfileService.
   * @param firestore Instancia de Firestore para interactuar con la base de datos.
   */
  constructor(private firestore: Firestore) {}

  /**
   * Obtiene el perfil de usuario desde Firestore.
   * @param id El ID del usuario cuyo perfil se desea obtener.
   * @returns Un observable con los datos del perfil del usuario.
   *          El tipo de los datos es cualquier tipo de objeto que esté almacenado en Firestore.
   */
  getUserProfile(id: string): Observable<any> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return from(getDoc(userDoc)).pipe(map(doc => doc.data()));
  }

  /**
   * Actualiza el perfil de un usuario en Firestore.
   * @param id El ID del usuario cuyo perfil se actualizará.
   * @param updatedData Los datos actualizados que se desean guardar en Firestore.
   * @returns Una promesa que indica que la actualización ha sido completada.
   */
  updateUserProfile(id: string, updatedData: any): Promise<void> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return updateDoc(userDoc, updatedData);
  }

}
