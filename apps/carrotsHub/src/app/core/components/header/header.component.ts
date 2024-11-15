import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiSvgModule, TuiButtonModule, TuiLinkModule } from "@taiga-ui/core";
import { Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { PageRoutes } from "../../../app.routes-path";
import { AuthService } from "../../../auth/services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    TuiSvgModule,
    TuiButtonModule,
    TuiLinkModule,
    RouterLink,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  pageRoutes = PageRoutes;
  readonly loading = signal(false);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  user$ = this.authService.currentUser$;

  onLogout() {
    this.loading.set(true);
    this.authService
      .logout()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate([PageRoutes.Login]);
        },
        error: (error) => {
          console.error("Ошибка при выходе:", error); // логгер
        },
      });
  }
}
