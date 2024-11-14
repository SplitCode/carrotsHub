import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiButtonModule } from "@taiga-ui/core";
import { Router, RouterLink } from "@angular/router";
import { finalize } from "rxjs";
import { TuiLinkModule } from "@taiga-ui/core";
import { AuthService } from "../auth/services/auth.service";
import { PageRoutes } from "../app.routes-path";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, TuiButtonModule, TuiLinkModule, RouterLink],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
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
