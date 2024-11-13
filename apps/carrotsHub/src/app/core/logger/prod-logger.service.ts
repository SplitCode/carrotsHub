import { Injectable } from "@angular/core";
import { getAnalytics, logEvent } from "firebase/analytics";
import type { LogEvent, Logger } from "./logger.models";

@Injectable({
  providedIn: "root",
})
export class ProdLoggerService implements Logger {
  private readonly analytics = getAnalytics();

  logInfo(event: LogEvent) {
    this.sendToAnalytics(event);
  }

  logWarn(event: LogEvent) {
    this.sendToAnalytics(event);
  }

  logError(event: LogEvent) {
    this.sendToAnalytics(event);
  }

  private sendToAnalytics(event: LogEvent) {
    logEvent(this.analytics, event.name, event.params);
  }
}
