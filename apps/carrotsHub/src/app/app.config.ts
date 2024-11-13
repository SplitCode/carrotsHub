import { provideAnimations } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import type { ApplicationConfig } from "@angular/core";
import {
  provideZoneChangeDetection,
  importProvidersFrom,
  isDevMode,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { FIREBASE_OPTIONS } from "@angular/fire/compat";
import { provideHttpClient } from "@angular/common/http";
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from "@taiga-ui/i18n";
import { of } from "rxjs";
import { provideAnalytics, getAnalytics } from "@angular/fire/analytics";
import { appRoutes } from "./app.routes";
import { loggerFactory } from "./core/services/logger/logger-factory";
import { Logger } from "./core/models/logger.models";

import { environment } from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    importProvidersFrom(TuiRootModule),
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_RUSSIAN_LANGUAGE),
    },
    {
      provide: Logger,
      useFactory: () => loggerFactory(isDevMode()),
    },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
};
