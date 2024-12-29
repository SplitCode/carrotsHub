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

  caloriesMax: number | null = null;
  proteinMax: number | null = null;
  fatMax: number | null = null;
  carbsMax: number | null = null;
  optimalWeight: number | null = null;

  readonly dailyCaloriesForm: FormGroup = new FormGroup({
    goal: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    age: new FormControl(null, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(120)],
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
      validators: [Validators.required, Validators.min(1), Validators.max(500)],
    }),
    height: new FormControl(null, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(300)],
    }),
  });

  onCalculate() {
    this.logger.logInfo({
      name: "CalculationKcalStarted",
    });

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

    // TODO: "get rid of magic numbers";
    this.proteinMax = Math.round((resultRSK * 0.2) / 4);
    this.fatMax = Math.round((resultRSK * 0.3) / 9);
    this.carbsMax = Math.round((resultRSK * 0.5) / 4);
    this.caloriesMax = resultRSK;
    this.optimalWeight = calculateOptimalWeightByBrock(height, gender);

    this.logger.logInfo({
      name: "CalculationSuccess",
    });

    this.user$
      .pipe(
        filter((user) => !!user),
        take(1),
        switchMap((user) =>
          this.userDataService.updateUserData(user.uid, {
            ...formValues,
            caloriesMax: this.caloriesMax,
            proteinMax: this.proteinMax,
            fatMax: this.fatMax,
            carbsMax: this.carbsMax,
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
            params: { error: error.message },
          });
        },
      });
  }

  ngOnInit() {
    this.userData$ = this.user$.pipe(
      filter((user) => !!user),
      switchMap((user) => this.userDataService.getUserData(user.uid)),
      tap((userData) => {
        if (userData) {
          this.logger.logInfo({
            name: "ProfileDataLoaded",
            params: {
              age: userData.age,
              goal: userData.goal,
              gender: userData.gender,
              weight: userData.weight,
              height: userData.height,
            },
          });

          this.dailyCaloriesForm.patchValue(userData);
          if (userData.caloriesMax) {
            this.caloriesMax = userData.caloriesMax;
            this.proteinMax = userData.proteinMax ?? null;
            this.fatMax = userData.fatMax ?? null;
            this.carbsMax = userData.carbsMax ?? null;
            this.optimalWeight = userData.optimalWeight ?? null;
          }
        }
      }),
      takeUntil(this.destroy$)
    );
  }
}
