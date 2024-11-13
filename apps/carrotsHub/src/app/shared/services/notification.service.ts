import { inject, Injectable } from "@angular/core";
import { TuiAlertService } from "@taiga-ui/core";
import {
  ERROR_MESSAGE_TITLE,
  SUCCESS_MESSAGE_TITLE,
} from "../constants/notification-messages";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private readonly alerts = inject(TuiAlertService);

  showSuccess(message: string, label: string = SUCCESS_MESSAGE_TITLE) {
    this.alerts
      .open(message, { label, status: "success", autoClose: true })
      .subscribe();
  }

  showError(message: string, label: string = ERROR_MESSAGE_TITLE) {
    this.alerts
      .open(message, { label, status: "error", autoClose: true })
      .subscribe();
  }
}
