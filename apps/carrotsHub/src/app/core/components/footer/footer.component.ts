import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TuiLinkModule } from "@taiga-ui/core";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, TuiLinkModule],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
