import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  of,
} from "rxjs";
import { CommonModule } from "@angular/common";
import {
  TuiButtonModule,
  TuiExpandModule,
  TuiTextfieldControllerModule,
} from "@taiga-ui/core";
import {
  TuiAccordionModule,
  TuiInputModule,
  TuiInputNumberModule,
} from "@taiga-ui/kit";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import type { Meal, MealItem } from "../../models/meals.interface";
import { FoodService } from "../../../api/services/food.service";
import { Logger } from "../../../core/logger/logger.models";

@Component({
  selector: "app-meals",
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiAccordionModule,
    TuiExpandModule,
    TuiInputModule,
    TuiInputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: "./meals.component.html",
  styleUrl: "./meals.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealsComponent implements OnInit {
  @Input() meals: Meal[] = [];
  @Output() addFood = new EventEmitter<{ meal: Meal; food: MealItem }>();
  @Output() removeFood = new EventEmitter<{ meal: Meal; index: number }>();

  private readonly foodService = inject(FoodService);
  private readonly logger = inject(Logger);
  private readonly cdr = inject(ChangeDetectorRef);

  onAddFoodToMeal(meal: Meal, food: any) {
    this.addFood.emit({ meal, food });
  }

  onSearch(meal: Meal) {
    meal.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.trim() === "") {
            meal.isLoading = false;
            meal.searchResults = [];
            this.cdr.detectChanges();
            return of([]);
          }

          meal.isLoading = true;

          this.logger.logInfo({
            name: "FoodSearchStarted",
            params: { query, mealType: meal.type },
          });

          return this.foodService.searchProduct(query).pipe(
            catchError(() => {
              this.logger.logError({
                name: "FoodSearchFailed",
                params: { query, mealType: meal.type },
              });

              meal.isLoading = false;
              meal.searchResults = [];
              this.cdr.detectChanges();
              return of([]);
            })
          );
        })
      )
      .subscribe((results) => {
        meal.searchResults = results;
        meal.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  ngOnInit() {
    this.setupSearchControls();
  }

  removeFoodFromMeal(meal: Meal, index: number) {
    this.removeFood.emit({ meal, index });
  }

  clearSearch(meal: Meal) {
    meal.searchResults = [];
    meal.searchControl.setValue("");
  }

  private setupSearchControls() {
    this.meals.forEach((meal) => {
      this.onSearch(meal);
    });
  }
}
