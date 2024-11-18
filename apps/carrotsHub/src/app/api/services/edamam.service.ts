import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import type { EdamamResponse } from "../models/edamam.interface";

@Injectable({
  providedIn: "root",
})
export class EdamamService {
  private readonly apiId = environment.edamam.apiId;
  private readonly apiKey = environment.edamam.apiKey;
  private readonly http = inject(HttpClient);

  searchRecipes(query: string): Observable<EdamamResponse> {
    // const url = "https://api.edamam.com/search";
    const url = "https://api.edamam.com/api/recipes/v2";
    const params = new HttpParams()
      .set("q", query)
      .set("app_id", this.apiId)
      .set("app_key", this.apiKey)
      .set("type", "public");

    const headers = new HttpHeaders({
      "Edamam-Account-User": this.apiId,
    });

    return this.http.get<EdamamResponse>(url, { headers, params });
  }

  getRecipeDetail(recipeId: string): Observable<any> {
    const url = "https://api.edamam.com/search";
    const params = new HttpParams()
      .set("r", recipeId)
      .set("app_id", this.apiId)
      .set("app_key", this.apiKey);

    // const url = `https://api.edamam.com/search?r=${recipeId}&app_id=${this.apiId}&app_key=${this.apiKey}`;
    return this.http.get<any>(url, { params });
  }
}
