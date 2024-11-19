import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MacronutrientsComponent } from "../components/macronutrients/macronutrients.component";
import { MealsComponent } from "../components/meals/meals.component";
import { WaterTrackerComponent } from "../components/water-tracker/water-tracker.component";
import { CaloriesChartComponent } from "../components/calories-chart/calories-chart.component";
import { EdamamService } from "../../api/services/edamam.service";
import { UserDataService } from "../../profile/services/user-data.service";

@Component({
  selector: "app-journal-page",
  standalone: true,
  imports: [
    CommonModule,
    WaterTrackerComponent,
    MacronutrientsComponent,
    MealsComponent,
    CaloriesChartComponent,
  ],
  templateUrl: "./journal-page.component.html",
  styleUrl: "./journal-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPageComponent {
  readonly caloriesMax = signal(2000);
  readonly proteinMax = signal(65);
  readonly fatMax = signal(44);
  readonly carbsMax = signal(160);

  // Текущие данные
  caloriesConsumed = 0;
  proteinCurrent = 0;
  fatCurrent = 0;
  carbsCurrent = 0;

  // Вода
  waterGlasses = Array(8).fill({ filled: false });
  totalWater = 0;

  // Приемы пищи
  meals = [
    { type: "Завтрак", totalCalories: 0 },
    { type: "Обед", totalCalories: 0 },
    { type: "Ужин", totalCalories: 0 },
    { type: "Перекус", totalCalories: 0 },
  ];

  private readonly edamamService = inject(EdamamService);
  private readonly userDataService = inject(UserDataService);

  // Добавление приема пищи
  onAddFood(mealType: string) {
    // запрос к апи?
    // обновление в дб
    console.info(mealType);
  }

  // Трекер воды
  onToggleWater(index: number) {
    this.waterGlasses[index].filled = !this.waterGlasses[index].filled;
    this.totalWater =
      this.waterGlasses.filter((glass) => glass.filled).length * 0.25;
    // сохранить в дб
  }
}
