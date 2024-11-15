import { Injectable } from "@angular/core";
import { getAnalytics, logEvent } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { environment } from "../../../environments/environment";
import type { LogEvent, Logger } from "./logger.models";
import { LogLevel } from "./logger.models";

const app = initializeApp(environment.firebase);

@Injectable({
  providedIn: "root",
})
export class DevLoggerService implements Logger {
  private readonly analytics = getAnalytics(app);

  logInfo(event: LogEvent) {
    this.sendToAnalytics(event);
    console.info(`[${LogLevel.INFO}]: ${event.name}`, event.params);
  }

  logWarn(event: LogEvent) {
    this.sendToAnalytics(event);
    console.warn(`[${LogLevel.WARN}]: ${event.name}`, event.params);
  }

  logError(event: LogEvent) {
    this.sendToAnalytics(event);
    console.error(`[${LogLevel.ERROR}]: ${event.name}`, event.params);
  }

  private sendToAnalytics(event: LogEvent) {
    logEvent(this.analytics, event.name, event.params);
  }
}
