import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-daily-calories-form",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./daily-calories-form.component.html",
  styleUrl: "./daily-calories-form.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyCaloriesFormComponent {
  readonly dailyCaloriesForm: FormGroup = new FormGroup({
    goal: new FormControl("", Validators.required),
    age: new FormControl("", [Validators.required, Validators.min(1)]),
    gender: new FormControl("", Validators.required),
    lifestyle: new FormControl("", Validators.required),
    weight: new FormControl("", [Validators.required, Validators.min(1)]),
    height: new FormControl("", [Validators.required, Validators.min(1)]),
  });

  onCalculate() {
    if (this.dailyCaloriesForm.valid) {
      // Логика расчета дневной нормы калорий будет здесь
      console.info("Форма для расчета калорий:", this.dailyCaloriesForm.value);
    }
  }
}
