import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiSvgModule, TuiButtonModule } from "@taiga-ui/core";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, TuiSvgModule, TuiButtonModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
