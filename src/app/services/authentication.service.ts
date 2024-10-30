import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, User, user } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { getAuth, getIdTokenResult } from 'firebase/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Inyección de dependencias para Firebase Authentication
  firebaseAuth = inject(Auth);  
  // Observable que emite el usuario autenticado
  user$ = user(this.firebaseAuth);

  constructor(private auth: Auth) { }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  loginWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  // Método para obtener el rol del usuario autenticado
  getUserRole(): Observable<string | null> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return from(getIdTokenResult(currentUser)).pipe(
        map(idTokenResult => (idTokenResult.claims['role'] as string) || null) // Ajuste de tipo aquí
      );
    }
    return of(null);
  }

  logout(): Observable<void> {
    return from(this.auth.signOut());
  }

}
