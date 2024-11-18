import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiSvgModule, TuiButtonModule, TuiLinkModule } from "@taiga-ui/core";
import { Router, RouterLink } from "@angular/router";
import { RouterModule } from "@angular/router";
import { finalize } from "rxjs";
import { PageRoutes } from "../../../shared/constants/app.routes-path";
import { AuthService } from "../../../auth/services/auth.service";
import { Logger } from "../../logger/logger.models";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    TuiSvgModule,
    TuiButtonModule,
    TuiLinkModule,
    RouterLink,
    RouterModule,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  pageRoutes = PageRoutes;
  isMenuOpen = false;
  readonly loading = signal(false);
  private readonly router = inject(Router);
  private readonly logger = inject(Logger);
  private readonly authService = inject(AuthService);

  user$ = this.authService.currentUser$;

  onLogout() {
    this.loading.set(true);
    this.authService
      .logout()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.logger.logInfo({ name: "logout_success" });
          this.router.navigate([PageRoutes.Login]);
        },
        error: (error) => {
          this.logger.logError({
            name: "logout_failed",
            params: { error: error.message },
          });
        },
      });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
