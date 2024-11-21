import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, map, of, type Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { EDAMAM_API_FOOD_URL } from "../constants/api.constants";

@Injectable({
  providedIn: "root",
})
export class FoodService {
  private readonly apiId = environment.edamamFood.apiId;
  private readonly apiKey = environment.edamamFood.apiKey;
  private readonly http = inject(HttpClient);

  searchProduct(query: string): Observable<any[]> {
    const params = new HttpParams()
      .set("ingr", query)
      .set("app_id", this.apiId)
      .set("app_key", this.apiKey);

    return this.http.get<any>(EDAMAM_API_FOOD_URL, { params }).pipe(
      map((response: any) => {
        if (response.hints && response.hints.length > 0) {
          return response.hints.map((hint: any) => {
            const food = hint.food;
            return {
              label: food.label,
              image: food.image || null,
              calories: food.nutrients.ENERC_KCAL || 0,
              protein: food.nutrients.PROCNT || 0,
              fat: food.nutrients.FAT || 0,
              carbs: food.nutrients.CHOCDF || 0,
              category: food.category || "Unknown",
            };
          });
        }
        return [];
      }),
      catchError(() => of([]))
    );
  }
}
