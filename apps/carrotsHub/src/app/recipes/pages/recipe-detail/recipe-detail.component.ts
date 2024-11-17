import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-recipe-detail",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./recipe-detail.component.html",
  styleUrl: "./recipe-detail.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailComponent {}
