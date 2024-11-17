// import type { OnInit } from "@angular/core";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
// import { catchError, debounceTime, of, switchMap } from "rxjs";
import type { Observable } from "rxjs";
import { catchError, of, map } from "rxjs";
import { EdamamService } from "../../api/services/edamam.service";

@Component({
  selector: "app-recipes-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./recipes-page.component.html",
  styleUrl: "./recipes-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesPageComponent {
  searchForm = new FormGroup({
    searchControl: new FormControl(""),
  });

  recipes$: Observable<any[]> = of([]);

  private readonly edamamService = inject(EdamamService);
  private readonly router = inject(Router);

  onSearch() {
    const query = this.searchForm.get("searchControl")?.value;

    if (query) {
      this.recipes$ = this.edamamService.searchRecipes(query).pipe(
        catchError((error) => {
          console.error("Ошибка при получении рецептов:", error);
          return of({ hits: [] });
        }),
        map((data) => data.hits.map((hit: any) => hit.recipe))
      );
    }
  }

  openRecipeDetail(recipeUri: string) {
    const recipeId = encodeURIComponent(recipeUri);
    this.router.navigate(["/recipe", recipeId]);
  }
}
