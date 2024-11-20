import { provideAnimations } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import type { ApplicationConfig } from "@angular/core";
import {
  provideZoneChangeDetection,
  importProvidersFrom,
  isDevMode,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { provideAnalytics, getAnalytics } from "@angular/fire/analytics";
import { provideDatabase, getDatabase } from "@angular/fire/database";
import { FIREBASE_OPTIONS } from "@angular/fire/compat";
import { TUI_ALERT_POSITION } from "@taiga-ui/core";
import { appRoutes } from "./app.routes";
import { loggerFactory } from "./core/logger/logger-factory";
import { Logger } from "./core/logger/logger.models";

import { environment } from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    provideDatabase(() => getDatabase()),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    importProvidersFrom(TuiRootModule),
    {
      provide: TUI_ALERT_POSITION,
      useValue: "6rem 3rem auto auto",
    },
    {
      provide: Logger,
      useFactory: () => loggerFactory(isDevMode()),
    },
  ],
};
