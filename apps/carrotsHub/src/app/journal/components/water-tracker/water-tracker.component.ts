import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserDataService } from "../../../profile/services/user-data.service";
import { AuthService } from "../../../auth/services/auth.service";

@Component({
  selector: "app-water-tracker",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./water-tracker.component.html",
  styleUrl: "./water-tracker.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaterTrackerComponent {
  private readonly authService = inject(AuthService);
  private readonly userDataService = inject(UserDataService);

  waterGlasses: Array<{ filled: boolean }> = Array.from({ length: 8 }, () => ({
    filled: false,
  }));

  totalWater = 0;
  userId!: string;

  constructor() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        // this.loadWaterData();
      }
    });
  }

  // onToggleWater(index: number) {
  //   this.waterGlasses[index].filled = !this.waterGlasses[index].filled;
  //   this.totalWater =
  //     this.waterGlasses.filter((glass) => glass.filled).length * 0.25;
  //   console.info(this.totalWater);
  //   this.saveWaterData();
  // }

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

  // private saveWaterData() {
  //   if (this.userId) {
  //     this.db.object(`users/${this.userId}/waterTracker`).set({
  //       waterGlasses: this.waterGlasses,
  //       totalWater: this.totalWater,
  //     });
  //   }
  // }

  // private loadWaterData() {
  //   if (this.userId) {
  //     this.db
  //       .object<{
  //         waterGlasses: Array<{ filled: boolean }>;
  //         totalWater: number;
  //       }>(`users/${this.userId}/waterTracker`)
  //       .valueChanges()
  //       .subscribe((data) => {
  //         if (data) {
  //           this.waterGlasses = data.waterGlasses;
  //           this.totalWater = data.totalWater;
  //         }
  //       });
  //   }
  // }
}
