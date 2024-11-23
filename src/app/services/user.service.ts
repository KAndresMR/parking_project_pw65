import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Auth, user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth)
  stateSpace: string = ''

  constructor(
    private firestore: Firestore, 
    private router: Router, 
    private auth: Auth) 
    { }

  async register(email: string, password: string, name: string, role: string = 'cliente', state: string = 'Inactivo'): Promise<void> {
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);
      const userId = userCredential.user.uid;
  
      // Guardar datos adicionales en Firestore
      const userRef = doc(this.firestore, 'users', userId);
      await setDoc(userRef, {
        id: userId,
        email: email,
        name: name,
        role: role,
        state: state
      });
  
      console.log('Usuario registrado exitosamente');
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      //this.router.navigate(['/login']);
    } catch (error) {
      const firebaseError = error as any; // Conversión explícita
      console.error('Error al registrar al usuario:', error);
      if (firebaseError.code === 'auth/email-already-in-use') {
        alert('El correo ya está registrado.');
      } else {
        alert('Hubo un problema al registrar al usuario. Intenta nuevamente.');
      }
    }
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

  async deleteUser(user: User): Promise <void> {    
    const batch = writeBatch(this.firestore)
    try {
      // 1. Eliminar el usuario      
      const userRef = doc(this.firestore, `users/${user.id}`);
      batch.delete(userRef);      

      // 2. Actualizar el estado del contrato
      if (user.state) {
        console.log("Estado del contrato: "+ user.state)
        const contractQuery = query(
          collection(this.firestore, 'contracts'),
          where('status', '==', user.state)
        );
        
        const contractSnapshot = await getDocs(contractQuery);
  
        if (!contractSnapshot.empty) {
          const userDoc = contractSnapshot.docs[0];
          const userRef = doc(this.firestore, `contracts/${userDoc.id}`);
          batch.update(userRef, { status: 'Inactivo' });
        }
      }
      if(user.state == 'Activo') {
        this.stateSpace = 'Ocupado'
      }      
      // 3. Actualizar el estado del espacio
      const spaceQuery = query(        
        collection(this.firestore, 'spaces'),
        where('status', '==', this.stateSpace)
      );
      console.log("Estado del usuario: "+ user.state)
      const spaceSnapshot = await getDocs(spaceQuery);
  
      if (!spaceSnapshot.empty) {
        const spaceDoc = spaceSnapshot.docs[0];
        const spaceRef = doc(this.firestore, `spaces/${spaceDoc.id}`);
        batch.update(spaceRef, { status: 'Disponible' });
      }
      // 4. Ejecutar las operaciones en lote
      await batch.commit();
      console.log('Usuario eliminado y entidades relacionadas actualizadas');
    } catch (error) {
      console.error('Error al eliminar usuario y actualizar datos relacionados:', error);
      throw error;
    }
  }


}
