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
  TuiDataListWrapperModule,
  TuiCheckboxLabeledModule,
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
import { VALIDATION_ERRORS } from "../../constants/validation-errors";

@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiInputModule,
    TuiTextareaModule,
    TuiButtonModule,
    TuiCheckboxLabeledModule,
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
  readonly loading = signal(false);
  private readonly router = inject(Router);

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

  onSubmit() {
    if (this.loginForm.valid) {
      // eslint-disable-next-line no-console
      console.log("Form Submitted", this.loginForm.value);
    } else {
      console.error("Form is invalid");
    }
  }
}
