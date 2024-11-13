import { Injectable } from "@angular/core";
import { getAnalytics, logEvent } from "firebase/analytics";
import type { LogEvent } from "../../models/logger.models";
import { LogLevel } from "../../models/logger.models";

@Injectable({
  providedIn: "root",
})
export class LoggerService {
  private readonly analytics = getAnalytics();

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
