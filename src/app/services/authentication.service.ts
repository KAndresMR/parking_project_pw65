import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User, user, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { getIdTokenResult } from 'firebase/auth';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { doc, setDoc } from 'firebase/firestore';
  // Asegúrate de tener un modelo de usuario

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Inyección de dependencias para Firebase Authentication
  firebaseAuth = inject(Auth);  
  // Inyección de Firestore
  private firestore = inject(Firestore);
  // Observable que emite el usuario autenticado
  user$ = user(this.firebaseAuth);

  constructor(private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password));
  }

  loginWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.firebaseAuth, provider));
  }

  // Método para obtener el rol del usuario autenticado
  getUserRole(): Observable<string | null> {
    const currentUser = this.firebaseAuth.currentUser;
    if (currentUser) {
      return from(getIdTokenResult(currentUser)).pipe(
        map(idTokenResult => (idTokenResult.claims['role'] as string) || null) // Ajuste de tipo aquí
      );
    }
    return of(null);
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

}
