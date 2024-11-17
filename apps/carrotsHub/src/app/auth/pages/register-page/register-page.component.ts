import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormGroup,
  FormControl,
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
import { passwordsMatchValidator } from "../../../shared/validators/confirm-passwors.validator";

@Component({
  selector: "app-register-page",
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
  templateUrl: "./register-page.component.html",
  styleUrl: "./register-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: VALIDATION_ERRORS,
    },
  ],
})
export class RegisterPageComponent {
  pageRoutes = PageRoutes;
  readonly loading = signal(false);
  private readonly router = inject(Router);
  private readonly logger = inject(Logger);
  private readonly authService = inject(AuthService);
  private readonly alerts = inject(NotificationService);

  readonly registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl<string>("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl<string>("", {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
          ),
        ],
      }),
      password: new FormControl<string>("", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl<string>("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordsMatchValidator }
  );

  onRegister() {
    this.loading.set(true);
    const { name, email, password } = this.registerForm.value;
    this.authService
      .register({ name, email, password })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.handleRegisterSuccess("email_password"),
        error: (error) => this.handleRegisterError(error, "email_password"),
      });
  }

  private handleRegisterSuccess(method: string) {
    this.logger.logInfo({
      name: "register_success",
      params: { method },
    });
    this.alerts.showSuccess(MESSAGES.successRegister);
    this.router.navigate([PageRoutes.Home]);
  }

  private handleRegisterError(error: Error, method: string) {
    this.logger.logError({
      name: "register_failed",
      params: {
        method,
        error: error.message,
      },
    });
    this.alerts.showError(error.message);
  }
}
