import type { OnInit } from "@angular/core";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-recipe-detail",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./recipe-detail.component.html",
  styleUrl: "./recipe-detail.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailComponent implements OnInit {
  recipe: any;

  private readonly apiId = "01ea880a";
  private readonly apiKey = "daaed082eb9b2c1bba652577a2e3326e";

  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get("id");
    if (recipeId) {
      this.getRecipeDetail(recipeId);
    }
  }

  getRecipeDetail(recipeId: string) {
    const url = `https://api.edamam.com/search?r=${recipeId}&app_id=${this.apiId}&app_key=${this.apiKey}`;
    this.http.get<any>(url).subscribe((data) => {
      this.recipe = data[0];
    });
  }
}
