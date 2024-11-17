import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { filter, switchMap, tap, type Observable } from "rxjs";
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
    switchMap((user) => this.userDataService.getUserData(user.uid)),
    tap((userData) => {
      if (userData) {
        this.dailyCaloriesForm.patchValue(userData);
        if (userData.calculatedCalories) {
          this.calculatedCalories = userData.calculatedCalories;
          this.protein = userData.protein ?? null;
          this.fat = userData.fat ?? null;
          this.carbohydrates = userData.carbohydrates ?? null;
        }
      }
    })
  );

  readonly goals = ["Снижение веса", "Поддержание веса", "Набор веса"];
  readonly genders = ["Мужской", "Женский"];
  readonly lifestyles = [
    "Сидячий",
    "Малоактивный",
    "Активный",
    "Очень активный",
  ];

  calculatedCalories: number | null = null;
  protein: number | null = null;
  fat: number | null = null;
  carbohydrates: number | null = null;

  readonly dailyCaloriesForm: FormGroup = new FormGroup({
    goal: new FormControl("", Validators.required),
    age: new FormControl("", [Validators.required, Validators.min(1)]),
    gender: new FormControl("", Validators.required),
    lifestyle: new FormControl("", Validators.required),
    weight: new FormControl("", [Validators.required, Validators.min(1)]),
    height: new FormControl("", [Validators.required, Validators.min(1)]),
  });

  onCalculate() {
    const formValues = this.dailyCaloriesForm.value;
    const { goal, age, gender, lifestyle, weight, height } = formValues;

    if (!this.dailyCaloriesForm.valid) {
      return;
    }

    const activityLevels: { [key: string]: number } = {
      Сидячий: 1.2,
      Малоактивный: 1.375,
      Активный: 1.55,
      "Очень активный": 1.725,
    };

    const activityMultiplier = activityLevels[lifestyle];

    let baseMetabolicRate: number;

    if (gender === "male") {
      baseMetabolicRate = 9.99 * weight + 6.25 * height - 4.92 * age + 5;
    } else {
      baseMetabolicRate = 9.99 * weight + 6.25 * height - 4.92 * age - 161;
    }

    const normRSK = Math.round(baseMetabolicRate * activityMultiplier);

    let resultRSK: number;

    if (goal === "Снижение веса") {
      resultRSK = Math.round(normRSK - normRSK * 0.2);
    } else if (goal === "Набор веса") {
      resultRSK = Math.round(normRSK + normRSK * 0.2);
    } else {
      resultRSK = normRSK;
    }

    this.protein = Math.round((resultRSK * 0.2) / 4);
    this.fat = Math.round((resultRSK * 0.3) / 9);
    this.carbohydrates = Math.round((resultRSK * 0.5) / 4);

    this.calculatedCalories = resultRSK;

    if (this.dailyCaloriesForm.valid) {
      console.info(
        "Форма для расчета калорий:",
        this.dailyCaloriesForm.value,
        resultRSK
      );

      this.user$
        .pipe(
          filter((user) => !!user),
          switchMap((user) =>
            this.userDataService.updateUserData(user.uid, {
              ...formValues,
              calculatedCalories: this.calculatedCalories,
              protein: this.protein,
              fat: this.fat,
              carbohydrates: this.carbohydrates,
            })
          )
        )
        .subscribe();
    }
  }
}

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
