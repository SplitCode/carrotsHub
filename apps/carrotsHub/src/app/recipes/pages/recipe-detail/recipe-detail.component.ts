import type { OnInit } from "@angular/core";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import type { Observable } from "rxjs";
import { map, of, switchMap } from "rxjs";
import { Location } from "@angular/common";
import { TuiLinkModule } from "@taiga-ui/core";
import { EdamamService } from "../../../api/services/edamam.service";
import type { RecipeDetail } from "../../models/recipe-detail.interface";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";

@Component({
  selector: "app-recipe-detail",
  standalone: true,
  imports: [CommonModule, TuiLinkModule, LoaderComponent],
  templateUrl: "./recipe-detail.component.html",
  styleUrl: "./recipe-detail.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailComponent implements OnInit {
  recipe$!: Observable<RecipeDetail | null>;

  readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly edamamService = inject(EdamamService);

  ngOnInit() {
    this.recipe$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const recipeId = params.get("id");
        if (recipeId) {
          return this.edamamService.getRecipeDetail(recipeId).pipe(
            map((recipe) => ({
              ...recipe,
              fat: recipe.digest[0].total || 0,
              protein: recipe.digest[2].total || 0,
              carbs: recipe.digest[1].total || 0,
            }))
          );
        }
        return of(null);
      })
    );
  }
}
