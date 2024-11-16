import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../auth/services/auth.service";

@Component({
  selector: "app-profile-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./profile-page.component.html",
  styleUrl: "./profile-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  private readonly authService = inject(AuthService);
  user$ = this.authService.currentUser$;
}
