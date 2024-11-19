import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiRingChartModule } from "@taiga-ui/addon-charts";
import { TuiProgressModule } from "@taiga-ui/kit";
import { EdamamService } from "../../api/services/edamam.service";
import { UserDataService } from "../../profile/services/user-data.service";
import { AuthService } from "../../auth/services/auth.service";
import type { UserData } from "../../profile/models/user-data.interface";

@Component({
  selector: "app-journal-page",
  standalone: true,
  imports: [CommonModule, TuiRingChartModule, TuiProgressModule],
  templateUrl: "./journal-page.component.html",
  styleUrl: "./journal-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalPageComponent implements OnInit {
  userId!: string;
  readonly caloriesMax = signal<number>(2000);
  readonly caloriesConsumed = signal<number>(200); // 0 по умолчанию
  readonly proteinMax = signal(65);
  readonly fatMax = signal(44);
  readonly carbsMax = signal(160);

  proteinCurrent = 10;
  fatCurrent = 30;
  carbsCurrent = 250;

  private readonly authService = inject(AuthService);
  private readonly userDataService = inject(UserDataService);
  private readonly edamamService = inject(EdamamService);

  // Приемы пищи
  meals = [
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
    // запрос к апи?
    // обновление в дб
    console.info(mealType);
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        this.loadUserData(user.uid);
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
}
