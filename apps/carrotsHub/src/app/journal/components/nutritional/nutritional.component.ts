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
import { AuthService } from "../../../auth/services/auth.service";
import { UserDataService } from "../../../profile/services/user-data.service";
import type { UserData } from "../../../profile/models/user-data.interface";

@Component({
  selector: "app-nutritional",
  standalone: true,
  imports: [CommonModule, TuiRingChartModule, TuiProgressModule],
  templateUrl: "./nutritional.component.html",
  styleUrl: "./nutritional.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NutritionalComponent implements OnInit {
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
          this.caloriesMax.set(userData.caloriesMax ?? 2000);
          this.proteinMax.set(userData.proteinMax ?? 65);
          this.fatMax.set(userData.fatMax ?? 44);
          this.carbsMax.set(userData.carbsMax ?? 160);
        }
      });
  }

  get caloriesLeft(): number {
    return this.caloriesMax() - this.caloriesConsumed();
  }
}
