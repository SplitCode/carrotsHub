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
import { GOAL, GENDER, LIFESTYLE, ACTIVITY_LEVELS } from "./constants/profile";
import { UserInfoComponent } from "./components/user-info/user-info.component";

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
    UserInfoComponent,
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

  readonly goals = Object.values(GOAL);
  readonly genders = Object.values(GENDER);
  readonly lifestyles = Object.values(LIFESTYLE);

  calculatedCalories: number | null = null;
  protein: number | null = null;
  fat: number | null = null;
  carbohydrates: number | null = null;

  readonly dailyCaloriesForm: FormGroup = new FormGroup({
    goal: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    age: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    gender: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lifestyle: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    weight: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    height: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  onCalculate() {
    const formValues = this.dailyCaloriesForm.value;
    const { goal, age, gender, lifestyle, weight, height } = formValues;

    const activityMultiplier = ACTIVITY_LEVELS[lifestyle as LIFESTYLE];

    const baseMetabolicRate = this.calculateBaseMetabolicRate(
      weight,
      height,
      age,
      gender
    );

    const normRSK = Math.round(baseMetabolicRate * activityMultiplier);
    const resultRSK = this.calculateCalories(goal, normRSK);

    this.protein = Math.round((resultRSK * 0.2) / 4);
    this.fat = Math.round((resultRSK * 0.3) / 9);
    this.carbohydrates = Math.round((resultRSK * 0.5) / 4);

    this.calculatedCalories = resultRSK;

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
            age: this.dailyCaloriesForm.value.age,
            height: this.dailyCaloriesForm.value.height,
            calculatedCalories: this.calculatedCalories,
            protein: this.protein,
            fat: this.fat,
            carbohydrates: this.carbohydrates,
          })
        )
      )
      .subscribe();
  }

  private calculateBaseMetabolicRate(
    weight: number,
    height: number,
    age: number,
    gender: GENDER
  ): number {
    if (gender === GENDER.male) {
      return 9.99 * weight + 6.25 * height - 4.92 * age + 5;
    }
    return 9.99 * weight + 6.25 * height - 4.92 * age - 161;
  }

  private calculateCalories(goal: GOAL, normRSK: number): number {
    switch (goal) {
      case GOAL.weightLoss:
        return Math.round(normRSK - normRSK * 0.2);
      case GOAL.weightGain:
        return Math.round(normRSK + normRSK * 0.2);
      case GOAL.maintenance:
      default:
        return normRSK;
    }
  }
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
