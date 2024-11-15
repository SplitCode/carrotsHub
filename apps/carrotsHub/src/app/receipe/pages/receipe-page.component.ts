import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-receipe-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./receipe-page.component.html",
  styleUrl: "./receipe-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceipePageComponent {}
