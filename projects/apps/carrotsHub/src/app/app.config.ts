import { provideAnimations } from '@angular/platform-browser/animations';
import { TuiRootModule } from '@taiga-ui/core';
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    importProvidersFrom(TuiRootModule),
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebase);
      console.log('Firebase App initialized:', app.name);
      return app;
    }),
    provideAnalytics(() => {
      const analytics = getAnalytics();
      console.log('Firebase Analytics initialized:', analytics);
      return analytics;
    }),
    provideAuth(() => {
      const auth = getAuth();
      console.log('Firebase Auth initialized:', auth);
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      console.log('Firestore initialized:', firestore);
      return firestore;
    }),
    // provideAnalytics(() => getAnalytics()),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore())
  ],
};
