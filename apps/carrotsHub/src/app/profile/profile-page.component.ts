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

  // onSaveProfile() {
  //   const updatedUserData = {
  //     address: this.profileForm.value.address,
  //     phoneNumber: this.profileForm.value.phoneNumber,
  //   };

  //   this.databaseService.updateUser(this.currentUser.uid, updatedUserData)
  //     .then(() => {
  //       this.alerts.showSuccess("Профиль успешно обновлен");
  //     })
  //     .catch((error) => {
  //       this.alerts.showError("Ошибка при обновлении профиля: " + error.message);
  //     });
  // }
}
