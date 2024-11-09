import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, user, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../models/user.model';
  

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {  
  firebaseAuth = inject(Auth);  
  private firestore = inject(Firestore); 
  user$ = user(this.firebaseAuth);

  constructor(
    private router: Router,
    private auth: Auth,    
  ) { }

  // Método para iniciar sesión y obtener el rol
  login(email: string, password: string): Observable<string | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(async (userCredential) => {
        const user = userCredential.user;
        if (user) {
          const role = await this.getUserRole(user.uid);
          if (role) {
            // Redirige según el rol
            if (role === 'administrador') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/profile']);
            }
          }
          return role;
        }
        return null;
      })
      
    );
  }

  loginWithGoogle(): Observable<void> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.firebaseAuth, provider)).pipe(
      switchMap(async (userCredential) => {
        const user = userCredential.user;
        if (user) {
          // Referencia al documento del usuario en Firestore
          const userRef = doc(this.firestore, `users/${user.uid}`);
          const userSnapshot = await getDoc(userRef);
  
          // Si el usuario no existe en Firestore, se crea con el rol 'cliente'
          if (!userSnapshot.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              name: user.displayName || '',
              role: 'cliente'
            });
          }
  
          // Redirige siempre a la pantalla de cliente
          this.router.navigate(['/register']);
        }
      }),
      catchError((error) => {
        console.error('Error al iniciar sesión con Google:', error);
        return of(undefined); // Retorna un valor sin error
      })
    );
  }
  

   // Método para obtener el rol del usuario desde Firestore
   private async getUserRole(uid: string): Promise<string | null> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return userData['role'] as string || null;
    }
    return null;
  } 

  logout(): Observable<void> {
    return from(this.firebaseAuth.signOut());
  }

  async registerUser(email: string, password: string, name: string) {
    console.log('Registrando usuario:', email);
    try {
      const userCredential = await createUserWithEmailAndPassword(this.firebaseAuth, email, password); // Cambiar a createUserWithEmailAndPassword
      const user = userCredential.user;

      // Guardar información adicional del usuario en Firestore
      if (user) {
        const userRef = doc(this.firestore, 'users', user.uid); // Referencia al documento del usuario
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: name,
          role: 'cliente' // Rol predeterminado
        });
        this.router.navigate(['/login']); // Redirige al usuario al login después del registro
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  // Método para obtener el ID del usuario actual
  getCurrentUserId(): string | null {
    const user = this.auth.currentUser; // Obtiene el usuario actual
    return user ? user.uid : null; // Retorna el ID del usuario o null si no hay usuario autenticado
  }

  getCurrentUser(): Observable<User | null> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      const userRef = doc(this.firestore, 'users', currentUser.uid);
      return from(getDoc(userRef)).pipe(
        map((snapshot) => (snapshot.exists() ? snapshot.data() as User : null))
      );
    }
    return of(null); // Retorna null si no hay usuario autenticado
  }

  logoutt(): Observable<void> {
    return from(this.firebaseAuth.signOut());
  }

}
