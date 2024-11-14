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
import { Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiTextfieldControllerModule,
  TuiLinkModule,
  TuiModeModule,
} from "@taiga-ui/core";
import {
  TuiInputModule,
  TuiTextareaModule,
  TuiFieldErrorPipeModule,
  TuiInputPasswordModule,
  TUI_VALIDATION_ERRORS,
} from "@taiga-ui/kit";
import { TuiDestroyService } from "@taiga-ui/cdk";
import { PageRoutes } from "../../../app.routes-path";
import { Logger } from "../../../core/logger/logger.models";
import { MESSAGES } from "../../../shared/constants/notification-messages";
import { NotificationService } from "../../../shared/services/notification.service";
import { AuthService } from "../../services/auth.service";
import { VALIDATION_ERRORS } from "../../constants/validation-errors";

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
    TuiModeModule,
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

  readonly registerForm: FormGroup = new FormGroup({
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
    confirmPassword: new FormControl<string>("", {
      nonNullable: true,
    }),
  });

  onRegister() {
    this.loading.set(true);
    this.authService
      .login({
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.logger.logInfo({
            name: "login_success",
            params: { method: "email_password" },
          });
          this.router.navigate([PageRoutes.Home]);
          this.alerts.showSuccess(MESSAGES.successLogin);
        },
        error: (error) => {
          this.logger.logError({
            name: "login_failed",
            params: {
              method: "email_password",
              error: error.message,
            },
          });
          console.error(error); // добавить вывод ошибки, перенаправить на регистрацию
        },
      });
  }
}
