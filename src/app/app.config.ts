import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyB7Y5P52d72eL6z54Owuxg3gNmSwD1fbMU",
        authDomain: "smart-station-e8035.firebaseapp.com",
        databaseURL: "https://smart-station-e8035-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "smart-station-e8035",
        storageBucket: "smart-station-e8035.firebasestorage.app",
        messagingSenderId: "528775045667",
        appId: "1:528775045667:web:788333e35c5436e0da0796"
      })
    ),
    provideDatabase(() => getDatabase())
  ]
};
