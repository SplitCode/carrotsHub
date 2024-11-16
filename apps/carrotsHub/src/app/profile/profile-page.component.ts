import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { filter, switchMap, type Observable } from "rxjs";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  TuiAvatarModule,
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
} from "@taiga-ui/kit";
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import { AuthService } from "../auth/services/auth.service";
import { UserDataService } from "./services/user-data.service";
import type { UserData } from "./models/user-data.interface";

@Component({
  selector: "app-profile-page",
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    TuiInputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiDataListModule,
    TuiSelectModule,
    TuiButtonModule,
    TuiAvatarModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: "./profile-page.component.html",
  styleUrl: "./profile-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  private readonly authService = inject(AuthService);
  private readonly userDataService = inject(UserDataService);
  user$ = this.authService.currentUser$;
  userData$: Observable<UserData | null> = this.authService.currentUser$.pipe(
    filter((user) => !!user),
    switchMap((user) => this.userDataService.getUserData(user.uid))
  );

  // ngOnInit(): void {
  //   this.authService.currentUser$.subscribe((user) => {
  //     if (user) {
  //       // Получаем данные пользователя из UserDataService
  //       this.userData$ = this.userDataService.getUserData(user.uid);
  //     }
  //   });
  // }

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
  readonly goals = ["Снижение веса", "Поддержание веса", "Набор веса"];
  readonly genders = ["Мужской", "Женский"];
  readonly lifestyles = [
    "Сидячий",
    "Малоактивный",
    "Активный",
    "Очень активный",
  ];

  readonly dailyCaloriesForm: FormGroup = new FormGroup({
    goal: new FormControl("", Validators.required),
    age: new FormControl("", [Validators.required, Validators.min(1)]),
    gender: new FormControl("", Validators.required),
    lifestyle: new FormControl("", Validators.required),
    weight: new FormControl("", [Validators.required, Validators.min(1)]),
    height: new FormControl("", [Validators.required, Validators.min(1)]),
  });

  onCalculate() {
    if (this.dailyCaloriesForm.valid) {
      console.info("Форма для расчета калорий:", this.dailyCaloriesForm.value);
    }
  }
}
