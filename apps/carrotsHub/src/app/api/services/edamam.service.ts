import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EdamamService {
  // private readonly apiId = environment.edamamApiId;
  // private readonly apiKey = environment.edamamApiKey;
  private readonly apiId = "01ea880a";
  private readonly apiKey = "daaed082eb9b2c1bba652577a2e3326e";
  private readonly http = inject(HttpClient);

  searchRecipes(query: string): Observable<any> {
    const url = `https://api.edamam.com/search?q=${query}&app_id=${this.apiId}&app_key=${this.apiKey}`;
    const headers = new HttpHeaders({
      "Edamam-Account-User": this.apiId, // Пример заголовка с user ID
    });

    return this.http.get<any>(url, { headers });
  }

  getRecipeDetail(recipeId: string): Observable<any> {
    const url = `https://api.edamam.com/search?r=${recipeId}&app_id=${this.apiId}&app_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}

export interface Recipe {
  image: string;
  label: string;
  calories: string;
}
