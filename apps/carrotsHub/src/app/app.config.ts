import { provideAnimations } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import type { ApplicationConfig } from "@angular/core";
import { provideZoneChangeDetection, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
// import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
// import { provideAnalytics, getAnalytics } from "@angular/fire/analytics";
// import { provideAuth, getAuth } from "@angular/fire/auth";
// import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { appRoutes } from "./app.routes";

// import { environment } from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    importProvidersFrom(TuiRootModule),
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
    // provideAnalytics(() => getAnalytics()),
  ],
};
