import { HttpClient, HttpHeaders } from "@angular/common/http";
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
    const url = `https://api.edamam.com/search?q=${query}&app_id=${this.apiId}&app_key=${this.apiKey}`;
    const headers = new HttpHeaders({
      "Edamam-Account-User": this.apiId,
    });

    return this.http.get<EdamamResponse>(url, { headers });
  }

  getRecipeDetail(recipeId: string): Observable<any> {
    const url = `https://api.edamam.com/search?r=${recipeId}&app_id=${this.apiId}&app_key=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}
