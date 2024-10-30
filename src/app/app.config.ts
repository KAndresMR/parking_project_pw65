import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA3D0BelX8E83MltePUUWJ5Fl50fRZOBeI",
  authDomain: "parkingppwp65.firebaseapp.com",
  projectId: "parkingppwp65",
  storageBucket: "parkingppwp65.appspot.com",
  messagingSenderId: "247296108380",
  appId: "1:247296108380:web:63c461c4ba6f812ec98399"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),     
    provideHttpClient(),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(()  => getAuth())
  ],
};
