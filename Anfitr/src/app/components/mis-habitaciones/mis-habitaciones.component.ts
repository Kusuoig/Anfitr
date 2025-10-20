import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface Habitacion {
  id: string;
  nombre: string;
  fechaCreacion: string;
  descripcion: string;
}

@Component({
  selector: 'app-mis-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-habitaciones.component.html',
  styleUrls: ['./mis-habitaciones.component.css']
})
export class MisHabitacionesComponent implements OnInit {
  usuario = {
    nombre: 'Paco El Chato',
    rol: 'Host'
  };

  busqueda: string = '';
  mostrarMenuPerfil: boolean = false;

  habitaciones: Habitacion[] = [
    {
      id: '1',
      nombre: 'Blue Origin Farm',
      fechaCreacion: 'June 16, 2025',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  ];

  habitacionesFiltradas: Habitacion[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.habitacionesFiltradas = this.habitaciones;
  }

  buscarHabitaciones() {
    if (!this.busqueda.trim()) {
      this.habitacionesFiltradas = this.habitaciones;
      return;
    }

    const termino = this.busqueda.toLowerCase();
    this.habitacionesFiltradas = this.habitaciones.filter(habitacion =>
      habitacion.nombre.toLowerCase().includes(termino) ||
      habitacion.descripcion.toLowerCase().includes(termino)
    );
  }

  editarHabitacion(habitacionId: string) {
    console.log('Editar habitación:', habitacionId);
  }

  eliminarHabitacion(habitacionId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta habitación?')) {
      this.habitaciones = this.habitaciones.filter(h => h.id !== habitacionId);
      this.buscarHabitaciones();
    }
  }

  nuevaHabitacion() {
    console.log('Crear nueva habitación');
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
