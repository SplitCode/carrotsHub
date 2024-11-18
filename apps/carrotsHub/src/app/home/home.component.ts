import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PageRoutes } from "../shared/constants/app.routes-path";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  pageRoutes = PageRoutes;
}
