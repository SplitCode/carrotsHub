import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-water-tracker",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./water-tracker.component.html",
  styleUrl: "./water-tracker.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaterTrackerComponent {
  // Вода
  waterGlasses = Array(8).fill({ filled: false });
  totalWater = 0;

  onToggleWater(index: number) {
    this.waterGlasses[index].filled = !this.waterGlasses[index].filled;
    this.totalWater =
      this.waterGlasses.filter((glass) => glass.filled).length * 0.25;
    // сохранить в дб
  }
}
