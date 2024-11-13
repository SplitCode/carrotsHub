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
  TuiModeModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import { Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { VALIDATION_ERRORS } from "../../constants/validation-errors";
import { AuthService } from "../../services/auth.service";
import { Logger } from "../../../core/logger/logger.models";
import { PageRoutes } from "../../../app.routes-path";
import { NotificationService } from "../../../shared/services/notification.service";
import { SUCCESS_LOGIN } from "../../../shared/constants/notification-messages";

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
    TuiModeModule,
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
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onLogin() {
    this.loading.set(true);
    this.authService
      .signIn({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.logger.logInfo({
            name: "login_success",
            params: { method: "email_password" },
          });
          this.router.navigate([PageRoutes.Home]);
          this.alerts.showSuccess(SUCCESS_LOGIN);
        },
        error: (error) => {
          this.logger.logError({
            name: "login_failed",
            params: {
              method: "email_password",
              error: error.message,
            },
          });
          // eslint-disable-next-line no-console
          console.log(error); // добавить вывод ошибки, перенаправить на регистрацию
        },
      });
  }
}
