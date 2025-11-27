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
  meses: number = 1;
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

    // Fecha fin es un mes después
    const unMesDespues = new Date(hoy);
    unMesDespues.setMonth(unMesDespues.getMonth() + 1);
    this.fechaFin = this.formatearFecha(unMesDespues);

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

  calcularMesesEntreFechas() {
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    
    let meses = (fin.getFullYear() - inicio.getFullYear()) * 12;
    meses += fin.getMonth() - inicio.getMonth();
    
    // Si el día final es menor que el día inicial, restamos un mes
    if (fin.getDate() < inicio.getDate()) {
      meses--;
    }
    
    return meses > 0 ? meses : 1;
  }

  onFechaInicioChange() {
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + this.meses);
    this.fechaFin = this.formatearFecha(fin);
    this.calcularPrecioTotal();
  }

  onFechaFinChange() {
    this.meses = this.calcularMesesEntreFechas();
    this.calcularPrecioTotal();
  }

  incrementarMeses() {
    this.meses++;
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + this.meses);
    this.fechaFin = this.formatearFecha(fin);
    this.calcularPrecioTotal();
  }

  decrementarMeses() {
    if (this.meses > 1) {
      this.meses--;
      const inicio = new Date(this.fechaInicio);
      const fin = new Date(inicio);
      fin.setMonth(fin.getMonth() + this.meses);
      this.fechaFin = this.formatearFecha(fin);
      this.calcularPrecioTotal();
    }
  }

  onMesesChange() {
    if (this.meses < 1) this.meses = 1;
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + this.meses);
    this.fechaFin = this.formatearFecha(fin);
    this.calcularPrecioTotal();
  }

  calcularPrecioTotal() {
    this.precioTotal = this.propiedad.precio * this.meses;
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
        meses: this.meses,
        total: this.precioTotal,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin
      }
    });
  }

  get textoMeses(): string {
    return this.meses === 1 ? 'mes' : 'meses';
  }
}
