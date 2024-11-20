import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiRingChartModule } from "@taiga-ui/addon-charts";
import {
  TuiAccordionModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiProgressModule,
} from "@taiga-ui/kit";
import {
  TuiButtonModule,
  TuiCalendarModule,
  TuiDialogModule,
  TuiDropdownModule,
  TuiExpandModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import { TuiMobileCalendarModule } from "@taiga-ui/addon-mobile";
import { TuiDay } from "@taiga-ui/cdk";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import type { Observable } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  switchMap,
} from "rxjs";
import { FoodService } from "../../api/services/food.service";
import { UserDataService } from "../../profile/services/user-data.service";
import { AuthService } from "../../auth/services/auth.service";
import type { UserData } from "../../profile/models/user-data.interface";
import { WaterTrackerComponent } from "../components/water-tracker/water-tracker.component";

export interface MealItem {
  label: string;
  quantity: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface Meal {
  type: string;
  totalCalories: number;
  searchControl: FormControl;
  searchResults: any[];
  items: MealItem[];
  isExpanded: boolean;
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
    TuiButtonModule,
    TuiAccordionModule,
    TuiExpandModule,
    TuiInputModule,
    WaterTrackerComponent,
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
  private readonly foodService = inject(FoodService);

  // аккордео
  meals: Meal[] = [
    {
      type: "Завтрак",
      totalCalories: 0,
      searchControl: new FormControl(""),
      searchResults: [],
      items: [],
      isExpanded: false,
    },
    {
      type: "Обед",
      totalCalories: 0,
      searchControl: new FormControl(""),
      searchResults: [],
      items: [],
      isExpanded: false,
    },
    {
      type: "Ужин",
      totalCalories: 0,
      searchControl: new FormControl(""),
      searchResults: [],
      items: [],
      isExpanded: false,
    },
    {
      type: "Перекус",
      totalCalories: 0,
      searchControl: new FormControl(""),
      searchResults: [],
      items: [],
      isExpanded: false,
    },
  ];

  constructor() {
    this.meals.forEach((meal) => {
      meal.searchControl.valueChanges
        .pipe(
          debounceTime(300),
          filter((query) => query && query.length >= 3),
          distinctUntilChanged(),
          switchMap((query) => this.searchProduct(query))
        )
        .subscribe((results) => {
          meal.searchResults = results;
        });
    });
  }

  onWaterChange(totalWater: number) {
    this.totalWater = totalWater;
    this.saveDailyData();
  }

  onDateChange(date: TuiDay) {
    this.selectedDate = date;
    console.info(this.selectedDate);
    const formattedDate = this.formatDateForFirebase(date);
    // перенести в хелперс
    this.loadUserDataByDay(this.userId, formattedDate);
  }

  // Добавление продукта в прием пищи
  onAddFoodToMeal(meal: Meal, food: any) {
    const quantity = 100; // По умолчанию количество продукта - 100 грамм
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

    // Обновляем текущие данные по нутриентам
    this.caloriesConsumed += item.calories;
    this.proteinCurrent += item.protein;
    this.fatCurrent += item.fat;
    this.carbsCurrent += item.carbs;

    // Сохранение данных в базу данных
    this.saveDailyData();
  }

  removeFoodFromMeal(meal: Meal, index: number) {
    const removedItem = meal.items[index];
    meal.totalCalories -= removedItem.calories;
    meal.items.splice(index, 1);

    // Обновляем текущие данные по нутриентам
    this.caloriesConsumed -= removedItem.calories;
    this.proteinCurrent -= removedItem.protein;
    this.fatCurrent -= removedItem.fat;
    this.carbsCurrent -= removedItem.carbs;

    // Сохранение изменений
    this.saveDailyData();
  }

  searchProduct(query: string): Observable<any[]> {
    const searchUrl = `https://world.openfoodfacts.org/api/v0/product/${query}.json`;
    return this.foodService.getProductData(searchUrl).pipe(
      switchMap((res: any) => {
        if (res && res.product) {
          const product = res.product;
          return of([
            {
              label: product.product_name,
              calories: product.nutriments["energy-kcal"] || 0,
              carbs: product.nutriments.carbohydrates || 0,
              protein: product.nutriments.proteins || 0,
              fat: product.nutriments.fat || 0,
            },
          ]);
        }
        return of([]);
      })
    );
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
        this.loadUserData(this.userId);
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
    // const dateString = date.toString();
    this.userDataService.getUserDataForDate(uid, date).subscribe((data) => {
      console.info("Загруженные данные из базы:", data);
      if (data) {
        console.info(data);
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
      }
    });
  }

  saveDailyData() {
    const dateString = this.formatDateForFirebase(this.selectedDate);
    // const dateString = this.selectedDate.toLocalNativeDate().toISOString().split("T")[0];
    this.userDataService
      .updateUserDataForDate(this.userId, dateString, {
        date: dateString,
        caloriesConsumed: this.caloriesConsumed,
        proteinCurrent: this.proteinCurrent,
        fatCurrent: this.fatCurrent,
        carbsCurrent: this.carbsCurrent,
        totalWater: this.totalWater,
        waterGlasses: this.waterGlasses,
      })
      .subscribe();
  }

  createEmptyWaterGlasses() {
    return Array.from({ length: 8 }, () => ({ filled: false }));
  }

  get caloriesLeft(): number {
    return this.caloriesMax() - this.caloriesConsumed;
  }

  // нужна ли?? не нужна
  // resetData() {
  //   this.caloriesConsumed = 0;
  //   this.proteinCurrent = 0;
  //   this.fatCurrent = 0;
  //   this.carbsCurrent = 0;
  //   this.waterGlasses = this.createEmptyWaterGlasses();
  //   this.totalWater = 0;
  // }

  // вместо них saveDailyData

  // saveWaterData() {
  //   const dateString = this.selectedDate.toString();
  //   this.userDataService.updateUserData(this.userId, {
  //     [`waterData/${dateString}`]: {
  //       waterGlasses: this.waterGlasses,
  //       totalWater: this.totalWater,
  //     },
  //   });
  // }

  // saveMealData(meal: Meal) {
  //   const dateString = this.selectedDate.toString();
  //   this.userDataService
  //     .updateUserData(this.userId, {
  //       [`meals/${dateString}/${meal.type}`]: {
  //         items: meal.items,
  //         totalCalories: meal.totalCalories,
  //       },
  //     })
  //     .subscribe();
  // }

  private formatDateForFirebase(date: TuiDay): string {
    // Преобразуем дату в формат 'YYYY-MM-DD', который не содержит запрещенных символов
    const year = date.year;
    const month = (date.month + 1).toString().padStart(2, "0"); // Добавляем 1, так как TuiDay использует месяц от 0 до 11
    const day = date.day.toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}
