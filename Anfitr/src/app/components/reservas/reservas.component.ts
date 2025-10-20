import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  usuario = {
    nombre: 'Juan Perez',
    rol: 'User'
  };

  busqueda: string = '';
  mostrarMenuPerfil: boolean = false;
  
  reservas: Reserva[] = [
    {
      id: '1',
      nombre: 'Blue Origin Farms',
      ubicacion: 'South of Legazpi',
      imagen: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
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

  nuevaReserva() {
    console.log('Crear nueva reserva');
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
