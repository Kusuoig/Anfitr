import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { AuthService, Usuario } from '../../services/auth.service';
import { ReservaService } from '../../services/reserva.service';


interface Reserva {
  _id: string;
  habitacion: {
    nombre: string;
    imagenes: string[];
  };
  fechaInicio: string;
  fechaFin: string;
  meses: number;
  montoTotal: number;
  estado: string;
  numeroTarjetaUltimos4?: string;
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html'
})
export class ReservasComponent implements OnInit {
  usuarioActual: Usuario | null = null;

  busqueda: string = '';
  mostrarMenuPerfil: boolean = false;
  cargando: boolean = false;

  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];

  // Mapeo de imágenes bonitas por nombre de habitación
  imagenesMap: { [key: string]: string } = {
    'Shangri-La': 'https://www.palosantohotel.com/wp-content/uploads/2019/08/PaloSanto-PremiumRoom-1-1-scaled-e1623178720137.jpg',
    'Top View': 'https://covive.mx/wp-content/uploads/2023/10/CUARTOS-EN-RENTA-CDMX.jpg',
    'Green Villa': 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/470292656.jpg?k=ea89235887ff7b2167ac2ef35e35c324244524054638d33640cdbaf7e121591e&o=&hp=1',
    'Wooden Pit': 'https://img10.naventcdn.com/avisos/18/01/46/29/35/60/360x266/1528407007.jpg?isFirstImage=true'
  };

  constructor(
    private authService: AuthService,
    private reservaService: ReservaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    if (this.usuarioActual) {
      this.cargarReservas();
    }
  }

  cargarReservas() {
    if (!this.usuarioActual?.id) return;

    this.cargando = true;
    this.reservaService.obtenerReservasUsuario(this.usuarioActual.id).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.success) {
          // Agregar las imágenes correctas a cada reserva
          this.reservas = response.data.map((reserva: any) => {
            const nombreHabitacion = reserva.habitacion?.nombre || '';
            let imgUrl: string;
            
            // Si la habitación tiene imágenes en la BD (uploads), usar esas
            if (reserva.habitacion?.imagenes && reserva.habitacion.imagenes.length > 0 && 
                reserva.habitacion.imagenes[0].startsWith('uploads/')) {
              imgUrl = `http://localhost:3000/${reserva.habitacion.imagenes[0]}`;
            } else {
              // Si no, usar el mapeo de imágenes bonitas
              imgUrl = this.imagenesMap[nombreHabitacion] || 'https://via.placeholder.com/400x300';
            }
            
            return {
              ...reserva,
              habitacion: {
                ...reserva.habitacion,
                imagenes: [imgUrl] // Usar la imagen correcta
              }
            };
          });
          this.reservasFiltradas = this.reservas;
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al cargar reservas:', error);
      }
    });
  }

  buscarReservas() {
    if (!this.busqueda.trim()) {
      this.reservasFiltradas = this.reservas;
      return;
    }

    const termino = this.busqueda.toLowerCase();
    this.reservasFiltradas = this.reservas.filter(reserva =>
      reserva.habitacion?.nombre?.toLowerCase().includes(termino)
    );
  }

  verDetalles(reservaId: string) {
    console.log('Ver detalles de reserva:', reservaId);
  }

  eliminarReserva(reservaId: string) {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.reservaService.cancelarReserva(reservaId).subscribe({
        next: (response) => {
          if (response.success) {
            this.cargarReservas();
          }
        },
        error: (error) => {
          console.error('Error al cancelar reserva:', error);
        }
      });
    }
  }

  volverInicio() {
    window.location.href = '/';
  }

  toggleMenuPerfil() {
    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
  }

  irAPerfil() {
    console.log('Ir a perfil');
    // Aquí puedes agregar la navegación: this.router.navigate(['/perfil']);
  }

  irAConfiguracion() {
    this.mostrarMenuPerfil = false;
    this.router.navigate(['/configuracion']);
  }

  cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.cerrarSesion();
    }
  }
}
