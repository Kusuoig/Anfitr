import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva-confirmacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva-confirmacion.html'
})
export class ReservaConfirmacion {
  constructor(private router: Router) {}

  volverAlInicio() {
    this.router.navigate(['/inicio']);
  }
}
