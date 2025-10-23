import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { AuthService, Usuario } from '../../services/auth.service';


interface Reserva {
  id: string;
  nombre: string;
  ubicacion: string;
  imagen: string;
  fechaInicio: string;
  fechaFin: string;
  dias: number;
  direccion: string;
  pagoTotal: number;
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

  reservas: Reserva[] = [
    {
      id: '1',
      nombre: 'Blue Origin Farms',
      ubicacion: 'South of Legazpi',
      imagen: 'https://a0.muscache.com/im/pictures/airflow/Hosting-33213510/original/80972a2f-7c48-426d-9035-de0675329db6.jpg?im_w=720',
      fechaInicio: '20 Enero',
      fechaFin: '22 Enero',
      dias: 3,
      direccion: 'Calle to Colombo Road 244, Main Street, Calle',
      pagoTotal: 400
    }
  ];

  reservasFiltradas: Reserva[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.reservasFiltradas = this.reservas;
    this.usuarioActual = this.authService.getUsuarioActual();
  }

  buscarReservas() {
    if (!this.busqueda.trim()) {
      this.reservasFiltradas = this.reservas;
      return;
    }

    const termino = this.busqueda.toLowerCase();
    this.reservasFiltradas = this.reservas.filter(reserva =>
      reserva.nombre.toLowerCase().includes(termino) ||
      reserva.ubicacion.toLowerCase().includes(termino) ||
      reserva.direccion.toLowerCase().includes(termino)
    );
  }

  verDetalles(reservaId: string) {
    console.log('Ver detalles de reserva:', reservaId);
  }

  eliminarReserva(reservaId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      this.reservas = this.reservas.filter(r => r.id !== reservaId);
      this.buscarReservas();
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
    console.log('Ir a configuración');
    // this.router.navigate(['/configuracion']);
  }

  cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.cerrarSesion();
    }
  }
}
