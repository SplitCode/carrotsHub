import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../auth/services/auth.service";
import { PageRoutes } from "../app.routes-path";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  pageRoutes = PageRoutes;
  private readonly authService = inject(AuthService);

  user$ = this.authService.currentUser$;
}
