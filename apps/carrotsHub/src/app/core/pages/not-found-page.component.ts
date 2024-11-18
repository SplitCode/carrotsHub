import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiButtonModule, TuiLinkModule } from "@taiga-ui/core";
import { RouterLink } from "@angular/router";
import { PageRoutes } from "../../shared/constants/app.routes-path";

@Component({
  selector: "app-not-found-page",
  standalone: true,
  imports: [CommonModule, TuiLinkModule, TuiButtonModule, RouterLink],
  templateUrl: "./not-found-page.component.html",
  styleUrl: "./not-found-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {
  pageRoutes = PageRoutes;
}
