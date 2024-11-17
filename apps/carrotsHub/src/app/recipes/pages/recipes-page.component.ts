import type { OnInit } from "@angular/core";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, debounceTime, of, switchMap } from "rxjs";

@Component({
  selector: "app-recipes-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./recipes-page.component.html",
  styleUrl: "./recipes-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesPageComponent implements OnInit {
  searchControl = new FormControl("");
  recipes: any[] = [];

  private readonly apiId = "01ea880a";
  private readonly apiKey = "daaed082eb9b2c1bba652577a2e3326e";

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        switchMap((query) => this.searchRecipes(query || "")),
        catchError((error) => {
          console.error("Ошибка при получении рецептов:", error);
          return of({ hits: [] });
        })
      )
      .subscribe((data) => {
        this.recipes = data.hits.map((hit: any) => hit.recipe);
      });
  }

  searchRecipes(query: string) {
    const url = `https://api.edamam.com/search?q=${query}&app_id=${this.apiId}&app_key=${this.apiKey}`;
    const headers = new HttpHeaders({
      "Edamam-Account-User": "01ea880a",
    });

    return this.http.get<any>(url, { headers });
  }

  openRecipeDetail(recipeUri: string) {
    const recipeId = encodeURIComponent(recipeUri);
    this.router.navigate(["/recipe", recipeId]);
  }
}
