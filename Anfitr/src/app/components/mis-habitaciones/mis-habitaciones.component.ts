import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Usuario } from '../../services/auth.service';

interface Habitacion {
  id: string;
  nombre: string;
  fechaCreacion: string;
  descripcion: string;
  deshabilitada: boolean;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  precioNoche?: number;
  numeroHabitaciones?: number;
  numeroBanos?: number;
}

interface FormularioHabitacion {
  nombre: string;
  descripcion: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  precioNoche: number | null;
  numeroHabitaciones: number | null;
  numeroBanos: number | null;
  imagen1: string;
  imagen2: string;
  imagen3: string;
}

@Component({
  selector: 'app-mis-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-habitaciones.component.html',

})
export class MisHabitacionesComponent implements OnInit {

  usuarioActual: Usuario | null = null;

  busqueda: string = '';
  mostrarMenuPerfil: boolean = false;
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  habitacionEditando: string | null = null;

  formulario: FormularioHabitacion = {
    nombre: '',
    descripcion: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    precioNoche: null,
    numeroHabitaciones: null,
    numeroBanos: null,
    imagen1: '',
    imagen2: '',
    imagen3: ''
  };

  habitaciones: Habitacion[] = [
    {
      id: '1',
      nombre: 'Blue Origin Farm',
      fechaCreacion: 'June 16, 2025',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      deshabilitada: false
    },
    {
      id: '2',
      nombre: 'Sunset Villa',
      fechaCreacion: 'July 5, 2025',
      descripcion: 'Hermosa villa con vista al mar, perfecta para unas vacaciones relajantes.',
      deshabilitada: false
    },
    {
      id: '3',
      nombre: 'Mountain Retreat',
      fechaCreacion: 'August 10, 2025',
      descripcion: 'Cabaña acogedora en las montañas, ideal para escapadas de fin de semana.',
      deshabilitada: true
    }
  ];

  habitacionesFiltradas: Habitacion[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.habitacionesFiltradas = this.habitaciones;
    this.usuarioActual = this.authService.getUsuarioActual();
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
    const habitacion = this.habitaciones.find(h => h.id === habitacionId);
    if (habitacion) {
      this.modoEdicion = true;
      this.habitacionEditando = habitacionId;
      this.formulario = {
        nombre: habitacion.nombre,
        descripcion: habitacion.descripcion,
        direccion: habitacion.direccion || '',
        ciudad: habitacion.ciudad || '',
        codigoPostal: habitacion.codigoPostal || '',
        precioNoche: habitacion.precioNoche || null,
        numeroHabitaciones: habitacion.numeroHabitaciones || null,
        numeroBanos: habitacion.numeroBanos || null,
        imagen1: '',
        imagen2: '',
        imagen3: ''
      };
      this.mostrarFormulario = true;
    }
  }

  eliminarHabitacion(habitacionId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta habitación?')) {
      this.habitaciones = this.habitaciones.filter(h => h.id !== habitacionId);
      this.buscarHabitaciones();
    }
  }

  deshabilitarHabitacion(habitacionId: string) {
    const habitacion = this.habitaciones.find(h => h.id === habitacionId);
    if (habitacion) {
      habitacion.deshabilitada = !habitacion.deshabilitada;
    }
  }

  nuevaHabitacion() {
    this.modoEdicion = false;
    this.habitacionEditando = null;
    this.resetFormulario();
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.resetFormulario();
  }

  resetFormulario() {
    this.formulario = {
      nombre: '',
      descripcion: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      precioNoche: null,
      numeroHabitaciones: null,
      numeroBanos: null,
      imagen1: '',
      imagen2: '',
      imagen3: ''
    };
  }

  validarFormulario(): boolean {
    return !!(
      this.formulario.nombre &&
      this.formulario.descripcion &&
      this.formulario.direccion &&
      this.formulario.ciudad &&
      this.formulario.codigoPostal &&
      this.formulario.precioNoche &&
      this.formulario.numeroHabitaciones &&
      this.formulario.numeroBanos &&
      this.formulario.imagen1
    );
  }

  onFileSelected(event: any, numeroImagen: number) {
    const file = event.target.files[0];
    if (file) {
      if (numeroImagen === 1) {
        this.formulario.imagen1 = file.name;
      } else if (numeroImagen === 2) {
        this.formulario.imagen2 = file.name;
      } else if (numeroImagen === 3) {
        this.formulario.imagen3 = file.name;
      }
    }
  }

  guardarHabitacion() {
    if (!this.validarFormulario()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (this.modoEdicion && this.habitacionEditando) {
      // Editar habitación existente
      const index = this.habitaciones.findIndex(h => h.id === this.habitacionEditando);
      if (index !== -1) {
        this.habitaciones[index] = {
          ...this.habitaciones[index],
          nombre: this.formulario.nombre,
          descripcion: this.formulario.descripcion,
          direccion: this.formulario.direccion,
          ciudad: this.formulario.ciudad,
          codigoPostal: this.formulario.codigoPostal,
          precioNoche: this.formulario.precioNoche!,
          numeroHabitaciones: this.formulario.numeroHabitaciones!,
          numeroBanos: this.formulario.numeroBanos!
        };
      }
      alert('Habitación actualizada exitosamente');
    } else {
      // Crear nueva habitación
      const nuevaHabitacion: Habitacion = {
        id: Date.now().toString(),
        nombre: this.formulario.nombre,
        descripcion: this.formulario.descripcion,
        fechaCreacion: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
        deshabilitada: false,
        direccion: this.formulario.direccion,
        ciudad: this.formulario.ciudad,
        codigoPostal: this.formulario.codigoPostal,
        precioNoche: this.formulario.precioNoche!,
        numeroHabitaciones: this.formulario.numeroHabitaciones!,
        numeroBanos: this.formulario.numeroBanos!
      };
      this.habitaciones.push(nuevaHabitacion);
      alert('Habitación creada exitosamente');
    }

    this.buscarHabitaciones();
    this.cerrarFormulario();
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
