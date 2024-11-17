import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiAvatarModule } from "@taiga-ui/kit";
import type { UserData } from "../../models/user-data.interface";

@Component({
  selector: "app-user-info",
  standalone: true,
  imports: [CommonModule, TuiAvatarModule],
  templateUrl: "./user-info.component.html",
  styleUrl: "./user-info.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent {
  @Input() userData: UserData | null = null;
}

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
