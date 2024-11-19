import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiRingChartModule } from "@taiga-ui/addon-charts";

@Component({
  selector: "app-calories-chart",
  standalone: true,
  imports: [CommonModule, TuiRingChartModule],
  templateUrl: "./calories-chart.component.html",
  styleUrl: "./calories-chart.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaloriesChartComponent {
  readonly caloriesMax = signal(2000); // данные из профиля
  readonly caloriesConsumed = signal(1200); // потребленные калории

  get caloriesLeft(): number {
    return this.caloriesMax() - this.caloriesConsumed();
  }
}
