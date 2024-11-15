import { inject, Injectable } from "@angular/core";
import { TuiAlertService } from "@taiga-ui/core";
import { MESSAGES } from "../constants/notification-messages";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private readonly alerts = inject(TuiAlertService);

  showSuccess(message: string, label: string = MESSAGES.successTitle) {
    this.alerts
      .open(message, {
        label,
        status: "success",
        autoClose: true,
        hasIcon: true,
      })
      .subscribe();
  }

  showError(message: string, label: string = MESSAGES.errorTitle) {
    this.alerts
      .open(message, { label, status: "error", autoClose: true, hasIcon: true })
      .subscribe();
  }
}
