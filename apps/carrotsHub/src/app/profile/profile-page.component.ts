import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  takeUntil,
  tap,
} from "rxjs";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
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
import { TuiDestroyService } from "@taiga-ui/cdk";
import { AuthService } from "../auth/services/auth.service";
import { UserDataService } from "./services/user-data.service";
import type { UserData } from "./models/user-data.interface";
import { GOAL, GENDER, LIFESTYLE, ACTIVITY_LEVELS } from "./constants/profile";
import { UserInfoComponent } from "./components/user-info/user-info.component";
import { Logger } from "../core/logger/logger.models";
import {
  calculateBaseMetabolicRate,
  calculateCalories,
  calculateOptimalWeightByBrock,
} from "./utils/calculation-utils";

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
    TuiTextfieldControllerModule,
    UserInfoComponent,
  ],
  templateUrl: "./profile-page.component.html",
  styleUrl: "./profile-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ProfilePageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userDataService = inject(UserDataService);
  private readonly destroy$ = inject(TuiDestroyService);
  private readonly logger = inject(Logger);

  readonly loading = signal(false);

  user$ = this.authService.currentUser$;
  userData$: Observable<UserData | null> = new Observable<UserData | null>();

  readonly goals = Object.values(GOAL);
  readonly genders = Object.values(GENDER);
  readonly lifestyles = Object.values(LIFESTYLE);

  calculatedCalories: number | null = null;
  protein: number | null = null;
  fat: number | null = null;
  carbohydrates: number | null = null;
  optimalWeight: number | null = null;

  readonly dailyCaloriesForm: FormGroup = new FormGroup({
    goal: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    age: new FormControl(null, {
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
    weight: new FormControl(null, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    height: new FormControl(null, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  onCalculate() {
    this.loading.set(true);

    const formValues = this.dailyCaloriesForm.value;
    const { goal, age, gender, lifestyle, weight, height } = formValues;

    const activityMultiplier = ACTIVITY_LEVELS[lifestyle as LIFESTYLE];
    const baseMetabolicRate = calculateBaseMetabolicRate(
      weight,
      height,
      age,
      gender
    );
    const normRSK = Math.round(baseMetabolicRate * activityMultiplier);
    const resultRSK = calculateCalories(goal, normRSK);

    this.protein = Math.round((resultRSK * 0.2) / 4);
    this.fat = Math.round((resultRSK * 0.3) / 9);
    this.carbohydrates = Math.round((resultRSK * 0.5) / 4);
    this.calculatedCalories = resultRSK;
    this.optimalWeight = calculateOptimalWeightByBrock(height, gender);

    this.user$
      .pipe(
        filter((user) => !!user),
        take(1),
        switchMap((user) =>
          this.userDataService.updateUserData(user.uid, {
            ...formValues,
            calculatedCalories: this.calculatedCalories,
            protein: this.protein,
            fat: this.fat,
            carbohydrates: this.carbohydrates,
            optimalWeight: this.optimalWeight,
          })
        ),
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.logger.logInfo({
            name: "UserDataUpdated",
            params: { userData: formValues },
          });
        },
        error: (error) => {
          this.logger.logError({
            name: "UserDataUpdateFailed",
            params: { error },
          });
        },
      });
  }

  ngOnInit(): void {
    this.userData$ = this.user$.pipe(
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
            this.optimalWeight = userData.optimalWeight ?? null;
          }
        }
      }),
      takeUntil(this.destroy$)
    );
  }
}
