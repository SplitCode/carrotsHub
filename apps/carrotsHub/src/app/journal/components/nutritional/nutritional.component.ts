import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiRingChartModule } from "@taiga-ui/addon-charts";
import { TuiProgressModule } from "@taiga-ui/kit";

@Component({
  selector: "app-nutritional",
  standalone: true,
  imports: [CommonModule, TuiRingChartModule, TuiProgressModule],
  templateUrl: "./nutritional.component.html",
  styleUrl: "./nutritional.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NutritionalComponent {
  @Input() caloriesConsumed!: number;
  @Input() caloriesMax!: number;
  @Input() proteinCurrent!: number;
  @Input() proteinMax!: number;
  @Input() fatCurrent!: number;
  @Input() fatMax!: number;
  @Input() carbsCurrent!: number;
  @Input() carbsMax!: number;

  get caloriesLeft(): number {
    return this.caloriesMax - this.caloriesConsumed;
  }
}
