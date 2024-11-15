import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-recipes-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./recipes-page.component.html",
  styleUrl: "./recipes-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesPageComponent {}
