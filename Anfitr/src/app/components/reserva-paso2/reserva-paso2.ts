import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../../services/pago.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reserva-paso2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-paso2.html'
})
export class ReservaPaso2 implements OnInit {
  // Datos de la reserva
  propiedad: any = {};
  meses: number = 1;
  total: number = 0;
  fechaInicio: string = '';
  fechaFin: string = '';

  // Datos del formulario
  nombreTarjeta: string = '';
  numeroTarjeta: string = '';
  banco: string = '';
  fechaVencimiento: string = '';
  cvv: string = '';

  // Estado del pago
  procesandoPago: boolean = false;
  errorPago: string = '';
  mostrarAlerta: boolean = false;
  tipoAlerta: 'success' | 'error' = 'success';
  mensajeAlerta: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pagoService: PagoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.propiedad = {
        id: params['id'],
        titulo: params['titulo'],
        ubicacion: params['ubicacion']
      };
      this.meses = parseInt(params['meses']) || 1;
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
    // Validar formulario
    if (!this.validarFormulario()) {
      return;
    }

    this.procesandoPago = true;
    this.errorPago = '';

    // Obtener información del usuario
    const usuario = this.authService.getUsuarioActual();

    const datosPago = {
      numeroTarjeta: this.numeroTarjeta.replace(/\s/g, ''),
      nombreTitular: this.nombreTarjeta,
      fechaVencimiento: this.fechaVencimiento,
      cvv: this.cvv,
      banco: this.banco,
      monto: this.total,
      emailUsuario: usuario?.email || null,
      usuarioId: usuario?.id || null,
      habitacionId: this.propiedad.id || null,
      datosReserva: {
        titulo: this.propiedad.titulo,
        ubicacion: this.propiedad.ubicacion,
        meses: this.meses,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin,
        nombreUsuario: usuario?.nombre || 'Cliente'
      }
    };

    this.pagoService.procesarPago(datosPago).subscribe({
      next: (response) => {
        this.procesandoPago = false;
        if (response.success) {
          this.mostrarAlertaExito(response.message || '¡Pago procesado exitosamente!');
          // Navegar a confirmación después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/reserva-confirmacion'], {
              queryParams: {
                titulo: this.propiedad.titulo,
                ubicacion: this.propiedad.ubicacion,
                meses: this.meses,
                total: this.total,
                fechaInicio: this.fechaInicio,
                fechaFin: this.fechaFin
              }
            });
          }, 2000);
        } else {
          this.mostrarAlertaError(response.message || 'Error al procesar el pago');
        }
      },
      error: (error) => {
        this.procesandoPago = false;
        const mensajeError = error.error?.message || 'Error al procesar el pago. Por favor intente nuevamente.';
        this.mostrarAlertaError(mensajeError);
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.nombreTarjeta.trim()) {
      this.mostrarAlertaError('Por favor ingrese el nombre del titular');
      return false;
    }

    const numeroLimpio = this.numeroTarjeta.replace(/\s/g, '');
    if (!/^\d{16}$/.test(numeroLimpio)) {
      this.mostrarAlertaError('El número de tarjeta debe tener 16 dígitos');
      return false;
    }

    if (!this.banco.trim()) {
      this.mostrarAlertaError('Por favor seleccione un banco');
      return false;
    }

    if (!this.fechaVencimiento) {
      this.mostrarAlertaError('Por favor ingrese la fecha de vencimiento');
      return false;
    }

    if (!/^\d{3}$/.test(this.cvv)) {
      this.mostrarAlertaError('El CVV debe tener 3 dígitos');
      return false;
    }

    return true;
  }

  mostrarAlertaExito(mensaje: string) {
    this.tipoAlerta = 'success';
    this.mensajeAlerta = mensaje;
    this.mostrarAlerta = true;
  }

  mostrarAlertaError(mensaje: string) {
    this.tipoAlerta = 'error';
    this.mensajeAlerta = mensaje;
    this.mostrarAlerta = true;
  }

  cerrarAlerta() {
    this.mostrarAlerta = false;
  }

  formatearNumeroTarjeta() {
    // Eliminar espacios
    let numero = this.numeroTarjeta.replace(/\s/g, '');
    // Limitar a 16 dígitos
    numero = numero.substring(0, 16);
  }

  // En tu componente .ts
formatearFechaVencimiento(event: any) {
  let value = event.target.value.replace(/\D/g, ''); // Remover todo excepto números

  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }

  this.fechaVencimiento = value;
}

  get textoMeses(): string {
    return this.meses === 1 ? 'mes' : 'meses';
  }
}
