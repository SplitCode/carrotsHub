import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-loader",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./loader.component.html",
  styleUrl: "./loader.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {}
