import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Recipe } from "../../models/recipe.interface";
// import { PageRoutes } from "../../../shared/constants/app.routes-path";

@Component({
  selector: "app-recipe-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./recipe-card.component.html",
  styleUrl: "./recipe-card.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeCardComponent {
  private readonly router = inject(Router);

  @Input() recipe!: Recipe;

  // onCardClick(recipeUri: string) {
  //   const recipeId = recipeUri.split("#recipe_")[1];
  //   if (recipeId) {
  //     this.router.navigate(["/recipes", recipeId]);
  //   }
  // }

  onCardClick() {
    const recipeId = this.extractRecipeId(this.recipe.uri);
    this.router.navigate([`/recipes/${recipeId}`]);
  }

  private extractRecipeId(recipeUri: string): string {
    return recipeUri.split("#recipe_")[1];
  }
}
