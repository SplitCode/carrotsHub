import type { OnInit } from "@angular/core";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import type { Observable } from "rxjs";
import { catchError, map, of, switchMap } from "rxjs";
import { Location } from "@angular/common";
import { TuiLinkModule, TuiSvgModule } from "@taiga-ui/core";
import { RecipesService } from "../../../api/services/recipes.service";
import type { RecipeDetail } from "../../models/recipe-detail.interface";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import { Logger } from "../../../core/logger/logger.models";

@Component({
  selector: "app-recipe-detail",
  standalone: true,
  imports: [CommonModule, TuiLinkModule, LoaderComponent, TuiSvgModule],
  templateUrl: "./recipe-detail.component.html",
  styleUrl: "./recipe-detail.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailComponent implements OnInit {
  recipe$!: Observable<RecipeDetail | null>;

  readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly recipesService = inject(RecipesService);
  private readonly logger = inject(Logger);

  onBack() {
    this.logger.logInfo({
      name: "RecipeDetailPageBack",
    });
    this.location.back();
  }

  ngOnInit() {
    this.recipe$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const recipeId = params.get("id");
        if (recipeId) {
          this.logger.logInfo({
            name: "RecipeDetailPageOpened",
            params: { recipeId },
          });

          return this.recipesService.getRecipeDetail(recipeId).pipe(
            map((recipe) => {
              this.logger.logInfo({
                name: "RecipeDetailLoaded",
                params: {
                  recipeId,
                  label: recipe.label,
                },
              });

              return {
                ...recipe,
                fat: recipe.digest[0]?.total || 0,
                protein: recipe.digest[2]?.total || 0,
                carbs: recipe.digest[1]?.total || 0,
              };
            }),
            catchError((error) => {
              this.logger.logError({
                name: "RecipeDetailLoadFailed",
                params: { recipeId, error: error.message },
              });
              return of(null);
            })
          );
        }
        return of(null);
      })
    );
  }
}
