import { Injectable } from "@angular/core";
import { getAnalytics, logEvent } from "firebase/analytics";

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  private readonly analytics = getAnalytics();

  logEvent(eventName: string, params: Record<string, unknown> = {}) {
    logEvent(this.analytics, eventName, params);
  }
}
