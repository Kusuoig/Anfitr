import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-crearcuenta',
  imports: [RouterLink],
  templateUrl: './crearcuenta.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CrearcuentaComponent { 
  showPassword=false
}
