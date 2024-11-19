import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiRingChartModule } from "@taiga-ui/addon-charts";
import { AuthService } from "../../../auth/services/auth.service";
import { UserDataService } from "../../../profile/services/user-data.service";
import type { UserData } from "../../../profile/models/user-data.interface";

@Component({
  selector: "app-calories-chart",
  standalone: true,
  imports: [CommonModule, TuiRingChartModule],
  templateUrl: "./calories-chart.component.html",
  styleUrl: "./calories-chart.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaloriesChartComponent implements OnInit {
  readonly caloriesMax = signal<number>(2000);
  readonly caloriesConsumed = signal<number>(200); // 0 по умолчанию
  readonly protein = signal<number>(0);
  readonly fat = signal<number>(0);
  readonly carbohydrates = signal<number>(0);

  private readonly authService = inject(AuthService);
  private readonly userDataService = inject(UserDataService);

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
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
          this.protein.set(userData.protein ?? 0);
          this.fat.set(userData.fat ?? 0);
          this.carbohydrates.set(userData.carbohydrates ?? 0);
        }
      });
  }

  get caloriesLeft(): number {
    return this.caloriesMax() - this.caloriesConsumed();
  }
}
