import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { of, switchMap, type Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FoodService {
  private readonly http = inject(HttpClient);

  searchProduct(query: string): Observable<any[]> {
    const searchUrl = `https://world.openfoodfacts.org/api/v0/product/${query}.json`;
    return this.http.get<any>(searchUrl).pipe(
      switchMap((res: any) => {
        if (res && res.product) {
          const product = res.product;
          return of([
            {
              label: product.product_name,
              calories:
                (product.nutriments["energy-kj_100g"] || 0) * 0.239005736,
              carbs: product.nutriments.carbohydrates_100g || 0,
              protein: product.nutriments.proteins_100g || 0,
              fat: product.nutriments.fat_100g || 0,
            },
          ]);
        }
        return of([]);
      })
    );
  }
}
