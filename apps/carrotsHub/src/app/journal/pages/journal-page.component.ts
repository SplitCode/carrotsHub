import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
} from "@taiga-ui/kit";
import {
  TuiCalendarModule,
  TuiDropdownModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import { TuiMobileCalendarModule } from "@taiga-ui/addon-mobile";
import { TuiDay } from "@taiga-ui/cdk";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { UserDataService } from "../../profile/services/user-data.service";
import { AuthService } from "../../auth/services/auth.service";
import type { UserData } from "../../profile/models/user-data.interface";
import { WaterTrackerComponent } from "../components/water-tracker/water-tracker.component";
import { formatDateForFirebase } from "../../shared/components/utils/date-formatter";
import { NutritionalComponent } from "../components/nutritional/nutritional.component";
import { initialMeals } from "../constants/initial-meals.const";
import type { Meal, MealItem } from "../models/meals.interface";
import { Logger } from "../../core/logger/logger.models";
import { MealsComponent } from "../components/meals/meals.component";

@Component({
  selector: "app-journal-page",
  standalone: true,
  imports: [
    CommonModule,
    TuiInputDateModule,
    TuiMobileCalendarModule,
    TuiCalendarModule,
    TuiDropdownModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiInputModule,
    WaterTrackerComponent,
    NutritionalComponent,
    TuiInputNumberModule,
    MealsComponent,
  ],
  templateUrl: "./journal-page.component.html",
  styleUrl: "./journal-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPageComponent implements OnInit {
  userId!: string;
  selectedDate = TuiDay.currentLocal();
  formattedDate: string = formatDateForFirebase(this.selectedDate);
  dateControl = new FormControl(TuiDay.currentLocal());

  readonly caloriesMax = signal<number>(2000);
  readonly proteinMax = signal(65);
  readonly fatMax = signal(44);
  readonly carbsMax = signal(160);

  caloriesConsumed = 0;
  proteinCurrent = 0;
  fatCurrent = 0;
  carbsCurrent = 0;

  waterGlasses: Array<{ filled: boolean }> = this.createEmptyWaterGlasses();
  totalWater = 0;

  private readonly authService = inject(AuthService);
  private readonly userDataService = inject(UserDataService);
  private readonly logger = inject(Logger);

  meals: Meal[] = initialMeals.map((meal) => ({
    ...meal,
    searchControl: new FormControl(meal.searchControl.value),
    searchResults: [],
    items: [],
    isExpanded: false,
    isLoading: false,
  }));

  onWaterChange(totalWater: number) {
    this.totalWater = totalWater;
    this.logger.logInfo({
      name: "TotalWater",
      params: { totalWater, date: this.formattedDate },
    });
    this.saveDailyData();
  }

  onDateChange(date: TuiDay) {
    this.selectedDate = date;
    this.formattedDate = formatDateForFirebase(date);
    this.loadUserDataByDay(this.userId, this.formattedDate);
  }

  onAddFoodToMeal(meal: Meal, food: any) {
    const quantity = food.quantity || 100;
    const item: MealItem = {
      label: food.label,
      calories: (food.calories / 100) * quantity,
      carbs: (food.carbs / 100) * quantity,
      protein: (food.protein / 100) * quantity,
      fat: (food.fat / 100) * quantity,
      quantity,
    };

    meal.items.push(item);
    meal.totalCalories += item.calories;

    this.caloriesConsumed += item.calories;
    this.proteinCurrent += item.protein;
    this.fatCurrent += item.fat;
    this.carbsCurrent += item.carbs;

    this.logger.logInfo({
      name: "FoodAddedToMeal",
      params: {
        mealType: meal.type,
        calories: meal.totalCalories,
      },
    });

    meal.searchResults = [];
    meal.searchControl.setValue("");

    this.saveDailyData();
  }

  removeFoodFromMeal(meal: Meal, index: number) {
    const removedItem = meal.items[index];
    meal.totalCalories -= removedItem.calories;
    meal.items.splice(index, 1);

    this.caloriesConsumed -= removedItem.calories;
    this.proteinCurrent -= removedItem.protein;
    this.fatCurrent -= removedItem.fat;
    this.carbsCurrent -= removedItem.carbs;

    this.saveDailyData();
  }

  ngOnInit() {
    this.setupDateControl();
    this.loadCurrentUser();
  }

  private setupDateControl() {
    this.dateControl.valueChanges.subscribe((date: TuiDay | null) => {
      if (date) {
        this.onDateChange(date);
      }
    });
  }

  private loadCurrentUser() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.loadUserData(this.userId);
        this.loadUserDataByDay(this.userId, this.formattedDate);
      }
    });
  }

  loadUserData(uid: string) {
    this.userDataService
      .getUserData(uid)
      .subscribe((userData: UserData | null) => {
        if (userData) {
          this.caloriesMax.set(userData.caloriesMax ?? 2000);
          this.proteinMax.set(userData.proteinMax ?? 65);
          this.fatMax.set(userData.fatMax ?? 44);
          this.carbsMax.set(userData.carbsMax ?? 160);
        }
      });
  }

  loadUserDataByDay(uid: string, date: string) {
    this.userDataService.getUserDataForDate(uid, date).subscribe((data) => {
      if (data) {
        this.caloriesConsumed = data.caloriesConsumed ?? 0;
        this.proteinCurrent = data.proteinCurrent ?? 0;
        this.fatCurrent = data.fatCurrent ?? 0;
        this.carbsCurrent = data.carbsCurrent ?? 0;
        this.waterGlasses = data.waterGlasses ?? this.createEmptyWaterGlasses();
        this.totalWater = data.totalWater ?? 0;

        this.meals.forEach((meal) => {
          const mealData = data.meals?.[meal.type];
          if (mealData) {
            meal.items = mealData.items || [];
            meal.totalCalories = mealData.totalCalories || 0;
          } else {
            meal.items = [];
            meal.totalCalories = 0;
          }
        });
      } else {
        this.resetData();
      }
    });
  }

  saveDailyData() {
    const mealsData: {
      [key: string]: { items: MealItem[]; totalCalories: number };
    } = {};
    this.meals.forEach((meal) => {
      mealsData[meal.type] = {
        items: meal.items,
        totalCalories: meal.totalCalories,
      };
    });

    this.userDataService
      .updateUserDataForDate(this.userId, this.formattedDate, {
        date: this.formattedDate,
        caloriesConsumed: this.caloriesConsumed,
        proteinCurrent: this.proteinCurrent,
        fatCurrent: this.fatCurrent,
        carbsCurrent: this.carbsCurrent,
        totalWater: this.totalWater,
        waterGlasses: this.waterGlasses,
        meals: mealsData,
      })
      .subscribe();
  }

  createEmptyWaterGlasses() {
    return Array.from({ length: 8 }, () => ({ filled: false }));
  }

  get caloriesLeft(): number {
    return this.caloriesMax() - this.caloriesConsumed;
  }

  resetData() {
    this.caloriesConsumed = 0;
    this.proteinCurrent = 0;
    this.fatCurrent = 0;
    this.carbsCurrent = 0;
    this.waterGlasses = this.createEmptyWaterGlasses();
    this.totalWater = 0;

    this.meals.forEach((meal) => {
      meal.items = [];
      meal.totalCalories = 0;
      meal.searchResults = [];
      meal.searchControl.setValue("");
      meal.isExpanded = false;
    });
  }

  getMealProtein(meal: Meal): number {
    return meal.items.reduce((sum, item) => sum + item.protein, 0);
  }

  getMealFat(meal: Meal): number {
    return meal.items.reduce((sum, item) => sum + item.fat, 0);
  }

  getMealCarbs(meal: Meal): number {
    return meal.items.reduce((sum, item) => sum + item.carbs, 0);
  }
}
