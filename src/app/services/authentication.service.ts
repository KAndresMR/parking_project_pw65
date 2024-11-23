import { inject, Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, user } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Firestore} from '@angular/fire/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../models/user.model';
import { signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {  
  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth)

  constructor(
    private firestore: Firestore,
    private router: Router,
    private auth: Auth,        
  ) { }

  // Método para iniciar sesión y obtener el rol
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      const userId = userCredential.user.uid;
  
      const userRef = doc(this.firestore, 'users', userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data() as { role: string };
        if (userData.role === 'administrador') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/profile']);
        }
      } else {
        alert('El usuario no está registrado en Firestore.');
      }
    } catch (error) {
      const firebaseError = error as any; // Conversión explícita
      console.error('Error en el inicio de sesión:', firebaseError);
  
      if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
        alert('Correo o contraseña incorrectos.');
      } else {
        alert('Hubo un problema al iniciar sesión. Intenta nuevamente.');
      }
    }
  }
  
  // Método para obtener el rol del usuario desde Firestore
  private async getUserRole(id: string): Promise<string | null> {
    console.log("Id del usuario: "+id)
    try{
      const userDoc = doc(this.firestore, `users/${id}`)
      const userSnapshot = await getDoc(userDoc)
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data()
        console.log('Datos del usuario recuperados:', userData)
        return userData['role'] as string || null
      } else {
        console.error('No se encontró el documento del usuario en Firestore.')
      }
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error)
    }
    return null
  }

  loginWithGoogle(): Observable<void> {
    const provider = new GoogleAuthProvider()
    return from(signInWithPopup(this.firebaseAuth, provider)).pipe(
      switchMap(async (userCredential) => {
        const user = userCredential.user
        if (user) {
          // Referencia al documento del usuario en Firestore
          const userRef = doc(this.firestore, `users/${user.uid}`)
          const userSnapshot = await getDoc(userRef)
          // Si el usuario no existe en Firestore, se crea con el rol 'cliente'
          if (!userSnapshot.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              password: 'admin123',
              name: user.displayName || '',
              role: 'cliente',
              state: 'N/D'
            })
          }
          // Redirige siempre a la pantalla de cliente
          this.router.navigate(['/profile'])
        }
      }),
      catchError((error) => {
        console.error('Error al iniciar sesión con Google:', error)
        return of(undefined) // Retorna un valor sin error
      })
    );
  }

  // Método para obtener el ID del usuario actual
  getCurrentUserId(): string | null {
    const user = this.auth.currentUser // Obtiene el usuario actual
    console.log("Usuario en el getCurretnUser: "+user)
    return user ? user.uid : null // Retorna el ID del usuario o null si no hay usuario autenticado
  }

  getCurrentUser(): Observable<User | null> {
    const currentUser = this.auth.currentUser
    if (currentUser) {
      const userRef = doc(this.firestore, 'users', currentUser.uid)
      return from(getDoc(userRef)).pipe(
        map((snapshot) => (snapshot.exists() ? snapshot.data() as User : null))
      )
    }
    return of(null) // Retorna null si no hay usuario autenticado
  }
}
