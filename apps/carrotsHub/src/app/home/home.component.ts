import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiAvatarModule } from "@taiga-ui/kit";
import { AuthService } from "../auth/services/auth.service";
import { PageRoutes } from "../shared/constants/app.routes-path";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, TuiAvatarModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  pageRoutes = PageRoutes;
  private readonly authService = inject(AuthService);

  user$ = this.authService.currentUser$;
}
