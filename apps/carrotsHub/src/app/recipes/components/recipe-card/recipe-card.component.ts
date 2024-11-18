import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Recipe } from "../../models/recipe.interface";

@Component({
  selector: "app-recipe-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./recipe-card.component.html",
  styleUrl: "./recipe-card.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;
}
