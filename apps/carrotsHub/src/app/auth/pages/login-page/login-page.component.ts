import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiTextareaModule,
  TUI_VALIDATION_ERRORS,
} from "@taiga-ui/kit";
import { TuiDestroyService } from "@taiga-ui/cdk";
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiLinkModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import { finalize } from "rxjs";
import { Router, RouterLink } from "@angular/router";
import { Logger } from "../../../core/logger/logger.models";
import { PageRoutes } from "../../../app.routes-path";
import { AuthService } from "../../services/auth.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { VALIDATION_ERRORS } from "../../constants/validation-errors";
import { MESSAGES } from "../../../shared/constants/notification-messages";

@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextareaModule,
    TuiButtonModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputPasswordModule,
    TuiTextfieldControllerModule,
    RouterLink,
    TuiLinkModule,
  ],
  templateUrl: "./login-page.component.html",
  styleUrl: "./login-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: VALIDATION_ERRORS,
    },
  ],
})
export class LoginPageComponent {
  pageRoutes = PageRoutes;
  readonly loading = signal(false);
  private readonly router = inject(Router);
  private readonly logger = inject(Logger);
  private readonly authService = inject(AuthService);
  private readonly alerts = inject(NotificationService);

  readonly loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/),
      ],
    }),
    password: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  onLogin() {
    this.loading.set(true);
    const { email, password } = this.loginForm.value;
    this.authService
      .login({ email, password })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.handleLoginSuccess("email_password"),
        error: (error) => this.handleLoginError(error, "email_password"),
      });
  }

  onGoogleLogin() {
    this.loading.set(true);
    this.authService
      .googleLogin()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.handleLoginSuccess("google"),
        error: (error) => this.handleLoginError(error, "google"),
      });
  }

  private handleLoginSuccess(method: string) {
    this.logger.logInfo({
      name: "login_success",
      params: { method },
    });
    this.alerts.showSuccess(MESSAGES.successLogin);
    this.router.navigate([PageRoutes.Home]);
  }

  private handleLoginError(error: Error, method: string) {
    this.logger.logError({
      name: "login_failed",
      params: {
        method,
        error: error.message,
      },
    });
    this.alerts.showError(error.message);
  }
}
