import type { OnInit } from "@angular/core";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import type { Observable } from "rxjs";
import { of, switchMap } from "rxjs";
import { EdamamService } from "../../../api/services/edamam.service";

@Component({
  selector: "app-recipe-detail",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./recipe-detail.component.html",
  styleUrl: "./recipe-detail.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailComponent implements OnInit {
  recipe$!: Observable<any>;

  private readonly route = inject(ActivatedRoute);
  private readonly edamamService = inject(EdamamService);

  ngOnInit() {
    this.recipe$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const recipeId = params.get("id");
        if (recipeId) {
          return this.edamamService.getRecipeDetail(recipeId);
        }
        return of(null);
      })
    );

    this.recipe$.subscribe((recipe) => {
      if (recipe) {
        console.info("Recipe data:", recipe);
      }
    });
  }
}

// ngOnInit() {
//   this.recipe$ = this.route.paramMap.pipe(
//     switchMap((params) => {
//       const recipeId = params.get("id");
//       if (recipeId) {
//         return this.edamamService.getRecipeDetail(recipeId);
//       }
//       return [];
//     })
//   );
// }
