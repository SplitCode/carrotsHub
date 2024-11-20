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

interface MealItem {
  label: string;
  quantity: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface Meal {
  type: string;
  totalCalories: number;
  searchControl: FormControl;
  searchResults: any[]; // Определите конкретный тип в зависимости от API
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
  caloriesConsumed = 0;
  readonly proteinMax = signal(65);
  readonly fatMax = signal(44);
  readonly carbsMax = signal(160);

  proteinCurrent = 10; // 0 по умолчанию
  fatCurrent = 30; // 0 по умолчанию
  carbsCurrent = 250; // 0 по умолчанию

  private readonly authService = inject(AuthService);
  private readonly userDataService = inject(UserDataService);
  private readonly foodService = inject(FoodService);

  // Вода
  waterGlasses: Array<{ filled: boolean }> = Array.from({ length: 8 }, () => ({
    filled: false,
  }));

  totalWater = 0;

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
          debounceTime(300), // Задержка на 300 мс после ввода
          filter((query) => query && query.length >= 3), // Искать только если длина больше или равна 3 символам
          distinctUntilChanged(),
          switchMap((query) => this.searchProduct(query)) // Поиск продуктов с API
        )
        .subscribe((results) => {
          meal.searchResults = results;
        });
    });
  }

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

  onDateChange(date: TuiDay) {
    this.selectedDate = date;
    // this.loadUserData(this.userId, date);
    this.loadUserDataByDay(this.userId, this.selectedDate);
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
    this.saveMealData(meal);
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
    this.saveMealData(meal);
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

  loadUserDataByDay(uid: string, date: TuiDay) {
    const dateString = date.toString();
    this.userDataService
      .getUserDataForDate(uid, dateString)
      .subscribe((data) => {
        if (data) {
          this.caloriesConsumed = data.caloriesConsumed ?? 0;
          this.proteinCurrent = data.proteinCurrent ?? 0;
          this.fatCurrent = data.fatCurrent ?? 0;
          this.carbsCurrent = data.carbsCurrent ?? 0;
          this.waterGlasses =
            data.waterGlasses ?? this.createEmptyWaterGlasses();
          this.totalWater = data.totalWater ?? 0;
        } else {
          this.resetData();
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

  createEmptyWaterGlasses() {
    return Array.from({ length: 8 }, () => ({ filled: false }));
  }

  get caloriesLeft(): number {
    return this.caloriesMax() - this.caloriesConsumed;
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
    this.caloriesConsumed = 0;
    this.proteinCurrent = 0;
    this.fatCurrent = 0;
    this.carbsCurrent = 0;
    this.waterGlasses = this.createEmptyWaterGlasses();
    this.totalWater = 0;
  }

  saveMealData(meal: Meal) {
    const dateString = this.selectedDate.toString();
    this.userDataService
      .updateUserData(this.userId, {
        [`meals/${dateString}/${meal.type}`]: {
          items: meal.items,
          totalCalories: meal.totalCalories,
        },
      })
      .subscribe();
  }
}
