import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-register-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./register-page.component.html",
  styleUrl: "./register-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {}
