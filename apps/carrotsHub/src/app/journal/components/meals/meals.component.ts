import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-meals",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./meals.component.html",
  styleUrl: "./meals.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealsComponent {
  // Приемы пищи
  meals = [
    { type: "Завтрак", totalCalories: 0 },
    { type: "Обед", totalCalories: 0 },
    { type: "Ужин", totalCalories: 0 },
    { type: "Перекус", totalCalories: 0 },
  ];

  // Добавление приема пищи
  onAddFood(mealType: string) {
    // запрос к апи?
    // обновление в дб
    console.info(mealType);
  }
}
