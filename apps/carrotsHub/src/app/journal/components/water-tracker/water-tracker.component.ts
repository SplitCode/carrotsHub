import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
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
  @Input() waterGlasses: Array<{ filled: boolean }> = [];
  @Input() totalWater = 0;
  @Output() waterChange = new EventEmitter<number>();

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
    this.waterChange.emit(this.totalWater);
  }
}
