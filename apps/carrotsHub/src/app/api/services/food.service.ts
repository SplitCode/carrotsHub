import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, map, of, type Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FoodService {
  private readonly apiId = environment.edamamFood.apiId;
  private readonly apiKey = environment.edamamFood.apiKey;
  private readonly http = inject(HttpClient);

  searchProduct(query: string): Observable<any[]> {
    const url = `https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(
      query
    )}&app_id=${this.apiId}&app_key=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map((response: any) => {
        if (response.parsed && response.parsed.length > 0) {
          const food = response.parsed[0].food;
          return [
            {
              label: food.label,
              calories: food.nutrients.ENERC_KCAL || 0,
              protein: food.nutrients.PROCNT || 0,
              fat: food.nutrients.FAT || 0,
              carbs: food.nutrients.CHOCDF || 0,
            },
          ];
        }
        return [];
      }),
      catchError(() => of([]))
    );
  }

  // searchProduct(query: string): Observable<any[]> {
  //   const searchUrl = `https://world.openfoodfacts.org/api/v0/product/${query}.json`;
  //   return this.http.get<any>(searchUrl).pipe(
  //     switchMap((res: any) => {
  //       if (res && res.product) {
  //         const product = res.product;
  //         return of([
  //           {
  //             label: product.product_name,
  //             calories:
  //               (product.nutriments["energy-kj_100g"] || 0) * 0.239005736,
  //             carbs: product.nutriments.carbohydrates_100g || 0,
  //             protein: product.nutriments.proteins_100g || 0,
  //             fat: product.nutriments.fat_100g || 0,
  //           },
  //         ]);
  //       }
  //       return of([]);
  //     })
  //   );
  // }
}
