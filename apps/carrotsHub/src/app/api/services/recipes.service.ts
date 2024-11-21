import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { map, type Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import type { RecipeResponse } from "../models/edamam.interface";
import type { RecipeDetail } from "../../recipes/models/recipe-detail.interface";
import { EDAMAM_API_URL } from "../constants/api.constants";

@Injectable({
  providedIn: "root",
})
export class RecipesService {
  private readonly apiId = environment.edamam.apiId;
  private readonly apiKey = environment.edamam.apiKey;
  private readonly http = inject(HttpClient);

  searchRecipes(query: string): Observable<RecipeResponse> {
    const params = new HttpParams()
      .set("q", query)
      .set("app_id", this.apiId)
      .set("app_key", this.apiKey)
      .set("type", "public");

    const headers = new HttpHeaders({
      "Edamam-Account-User": this.apiId,
    });

    return this.http.get<RecipeResponse>(EDAMAM_API_URL, { headers, params });
  }

  getRecipeDetail(recipeId: string): Observable<RecipeDetail> {
    const url = `${EDAMAM_API_URL}/${recipeId}`;

    const params = new HttpParams()
      .set("app_id", this.apiId)
      .set("app_key", this.apiKey)
      .set("type", "public");

    const headers = new HttpHeaders({
      "Edamam-Account-User": this.apiId,
    });

    return this.http
      .get<{ recipe: RecipeDetail }>(url, { headers, params })
      .pipe(map((response) => response.recipe));
  }
}
