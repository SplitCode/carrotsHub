import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiButtonModule } from "@taiga-ui/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth/services/auth.service";
import { PageRoutes } from "../app.routes-path";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, TuiButtonModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  onLogout() {
    this.authService.logout();
    this.router.navigate([PageRoutes.Login]);
  }
}
