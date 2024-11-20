import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FoodService {
  private readonly http = inject(HttpClient);

  getProductData(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
}
