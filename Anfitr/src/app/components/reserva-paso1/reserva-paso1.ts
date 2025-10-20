import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reserva-paso1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-paso1.html'
})
export class ReservaPaso1 implements OnInit {
  propiedad: any;
  dias: number = 1;
  fechaInicio: string = '';
  fechaFin: string = '';
  precioTotal: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtener la fecha actual
    const hoy = new Date();
    this.fechaInicio = this.formatearFecha(hoy);

    // Fecha fin es un día después
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    this.fechaFin = this.formatearFecha(manana);

    // Obtener datos de la propiedad (en producción vendría de un servicio)
    this.route.queryParams.subscribe(params => {
      this.propiedad = {
        id: params['id'] || 1,
        titulo: params['titulo'] || 'Shangri-La',
        ubicacion: params['ubicacion'] || 'Lakeside, ID 1234',
        precio: parseInt(params['precio']) || 1200,
        imgUrl: params['imgUrl'] || 'https://www.palosantohotel.com/wp-content/uploads/2019/08/PaloSanto-PremiumRoom-1-1-scaled-e1623178720137.jpg'
      };
      this.calcularPrecioTotal();
    });
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calcularDiasEntreFechas() {
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diferencia / (1000 * 3600 * 24));
    return dias > 0 ? dias : 1;
  }

  onFechaInicioChange() {
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + this.dias);
    this.fechaFin = this.formatearFecha(fin);
    this.calcularPrecioTotal();
  }

  onFechaFinChange() {
    this.dias = this.calcularDiasEntreFechas();
    this.calcularPrecioTotal();
  }

  incrementarDias() {
    this.dias++;
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + this.dias);
    this.fechaFin = this.formatearFecha(fin);
    this.calcularPrecioTotal();
  }

  decrementarDias() {
    if (this.dias > 1) {
      this.dias--;
      const inicio = new Date(this.fechaInicio);
      const fin = new Date(inicio);
      fin.setDate(fin.getDate() + this.dias);
      this.fechaFin = this.formatearFecha(fin);
      this.calcularPrecioTotal();
    }
  }

  onDiasChange() {
    if (this.dias < 1) this.dias = 1;
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + this.dias);
    this.fechaFin = this.formatearFecha(fin);
    this.calcularPrecioTotal();
  }

  calcularPrecioTotal() {
    this.precioTotal = this.propiedad.precio * this.dias;
  }

  cancelar() {
    this.router.navigate(['/detalles-cuarto'], {
      queryParams: { id: this.propiedad.id }
    });
  }

  reservarAhora() {
    this.router.navigate(['/reserva-paso2'], {
      queryParams: {
        id: this.propiedad.id,
        titulo: this.propiedad.titulo,
        ubicacion: this.propiedad.ubicacion,
        precio: this.propiedad.precio,
        dias: this.dias,
        total: this.precioTotal,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin
      }
    });
  }

  get textoDias(): string {
    return this.dias === 1 ? 'día' : 'días';
  }
}
