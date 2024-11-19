import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiProgressModule } from "@taiga-ui/kit";

@Component({
  selector: "app-macronutrients",
  standalone: true,
  imports: [CommonModule, TuiProgressModule],
  templateUrl: "./macronutrients.component.html",
  styleUrl: "./macronutrients.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MacronutrientsComponent {
  readonly caloriesMax = signal(2000);
  readonly proteinMax = signal(65);
  readonly fatMax = signal(44);
  readonly carbsMax = signal(160);

  // Текущие данные
  caloriesConsumed = 0;
  proteinCurrent = 0;
  fatCurrent = 0;
  carbsCurrent = 0;
}
