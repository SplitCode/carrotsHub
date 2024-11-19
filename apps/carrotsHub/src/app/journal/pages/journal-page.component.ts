import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiRingChartModule } from "@taiga-ui/addon-charts";
import { TuiInputDateModule, TuiProgressModule } from "@taiga-ui/kit";
import {
  TuiCalendarModule,
  TuiDialogModule,
  TuiDropdownModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import { TuiMobileCalendarModule } from "@taiga-ui/addon-mobile";
import { TuiDay } from "@taiga-ui/cdk";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { EdamamService } from "../../api/services/edamam.service";
import { UserDataService } from "../../profile/services/user-data.service";
import { AuthService } from "../../auth/services/auth.service";
import type { UserData } from "../../profile/models/user-data.interface";

export interface Meal {
  type: string;
  totalCalories: number;
}

@Component({
  selector: "app-journal-page",
  standalone: true,
  imports: [
    CommonModule,
    TuiRingChartModule,
    TuiProgressModule,
    TuiInputDateModule,
    TuiDialogModule,
    TuiMobileCalendarModule,
    TuiCalendarModule,
    TuiDropdownModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./journal-page.component.html",
  styleUrl: "./journal-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPageComponent implements OnInit {
  userId!: string;
  selectedDate = TuiDay.currentLocal();
  dateControl = new FormControl(TuiDay.currentLocal());
  readonly caloriesMax = signal<number>(2000);
  readonly caloriesConsumed = signal<number>(200); // 0 по умолчанию
  readonly proteinMax = signal(65);
  readonly fatMax = signal(44);
  readonly carbsMax = signal(160);

  proteinCurrent = 10; // 0 по умолчанию
  fatCurrent = 30; // 0 по умолчанию
  carbsCurrent = 250; // 0 по умолчанию

  private readonly authService = inject(AuthService);
  private readonly userDataService = inject(UserDataService);
  private readonly edamamService = inject(EdamamService);

  // Приемы пищи
  meals: Meal[] = [
    { type: "Завтрак", totalCalories: 0 },
    { type: "Обед", totalCalories: 0 },
    { type: "Ужин", totalCalories: 0 },
    { type: "Перекус", totalCalories: 0 },
  ];

  // Вода
  waterGlasses: Array<{ filled: boolean }> = Array.from({ length: 8 }, () => ({
    filled: false,
  }));

  totalWater = 0;

  onToggleWater(index: number) {
    if (!this.waterGlasses[index].filled) {
      if (index === 0 || this.waterGlasses[index - 1].filled) {
        this.waterGlasses[index].filled = true;
      }
    } else if (
      index === this.waterGlasses.length - 1 ||
      !this.waterGlasses[index + 1].filled
    ) {
      this.waterGlasses[index].filled = false;
    }

    this.totalWater =
      this.waterGlasses.filter((glass) => glass.filled).length * 0.25;

    console.info(this.totalWater);
    // this.saveWaterData();
  }

  // Добавление приема пищи
  onAddFood(mealType: string) {
    // Логика открытия поиска еды, обращения к API, и обновления данных в Firebase
    console.info(mealType);
    // После получения информации об еде - обновляем калории, белки, жиры, углеводы
  }

  onDateChange(date: TuiDay) {
    this.selectedDate = date;
    // this.loadUserData(this.userId, date);
    this.loadUserDataByDay(this.userId, this.selectedDate);
  }

  ngOnInit() {
    this.dateControl.valueChanges.subscribe((date: TuiDay | null) => {
      if (date) {
        this.onDateChange(date);
      }
    });

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        // this.loadUserData(this.userId, this.selectedDate);
      }
    });
  }

  loadUserDataByDay(uid: string, date: TuiDay) {
    const dateString = date.toString();
    this.userDataService
      .getUserDataForDate(uid, dateString)
      .subscribe((data) => {
        if (data) {
          this.caloriesMax.set(data.caloriesMax ?? 2000);
          this.caloriesConsumed.set(data.caloriesConsumed ?? 0);
          this.proteinCurrent = data.proteinCurrent ?? 0;
          this.fatCurrent = data.fatCurrent ?? 0;
          this.carbsCurrent = data.carbsCurrent ?? 0;
          // this.waterGlasses =
          //   data.waterGlasses ??
          //   Array.from({ length: 8 }, () => ({
          //     filled: false,
          //   }));
          this.totalWater = data.totalWater ?? 0;
        } else {
          // Если данных нет, сбрасываем значения по умолчанию
          this.resetData();
        }
      });
  }

  loadUserData(uid: string) {
    this.userDataService
      .getUserData(uid)
      .subscribe((userData: UserData | null) => {
        if (userData) {
          this.caloriesMax.set(userData.calculatedCalories ?? 2000);
          this.proteinMax.set(userData.protein ?? 65);
          this.fatMax.set(userData.fat ?? 44);
          this.carbsMax.set(userData.carbohydrates ?? 160);
        }
      });
  }

  get caloriesLeft(): number {
    return this.caloriesMax() - this.caloriesConsumed();
  }

  saveWaterData() {
    const dateString = this.selectedDate.toString();
    this.userDataService.updateUserData(this.userId, {
      [`waterData/${dateString}`]: {
        waterGlasses: this.waterGlasses,
        totalWater: this.totalWater,
      },
    });
  }

  resetData() {
    this.caloriesMax.set(2000);
    this.caloriesConsumed.set(0);
    this.proteinCurrent = 0;
    this.fatCurrent = 0;
    this.carbsCurrent = 0;
    this.waterGlasses = Array.from({ length: 8 }, () => ({ filled: false }));
    this.totalWater = 0;
  }
}
