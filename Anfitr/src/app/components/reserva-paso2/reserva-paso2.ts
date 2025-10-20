import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reserva-paso2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-paso2.html'
})
export class ReservaPaso2 implements OnInit {
  // Datos de la reserva
  propiedad: any = {};
  dias: number = 1;
  total: number = 0;
  fechaInicio: string = '';
  fechaFin: string = '';

  // Datos del formulario
  nombreTarjeta: string = '';
  numeroTarjeta: string = '';
  banco: string = '';
  fechaVencimiento: string = '';
  cvv: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.propiedad = {
        id: params['id'],
        titulo: params['titulo'],
        ubicacion: params['ubicacion']
      };
      this.dias = parseInt(params['dias']) || 1;
      this.total = parseInt(params['total']) || 0;
      this.fechaInicio = params['fechaInicio'];
      this.fechaFin = params['fechaFin'];
    });
  }

  cancelar() {
    this.router.navigate(['/detalles-cuarto'], {
      queryParams: { id: this.propiedad.id }
    });
  }

  pagarAhora() {
    // En producción aquí se procesaría el pago
    this.router.navigate(['/reserva-confirmacion']);
  }

  get textoDias(): string {
    return this.dias === 1 ? 'día' : 'días';
  }
}
