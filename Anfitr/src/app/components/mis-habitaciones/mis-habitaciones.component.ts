import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Usuario } from '../../services/auth.service';
import { HabitacionService } from '../../services/habitacion.service';

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

  habitaciones: Habitacion[] = [];
  habitacionesFiltradas: Habitacion[] = [];

  constructor(
    private authService: AuthService,
    private habitacionService: HabitacionService
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.habitacionesFiltradas = this.habitaciones;
    if (this.usuarioActual && this.usuarioActual.id) {
      this.cargarMisHabitaciones();
    }
  }

  cargarMisHabitaciones() {
    if (!this.usuarioActual || !this.usuarioActual.id) return;
    this.habitacionService.getMisHabitaciones(this.usuarioActual.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.habitaciones = res.data.map((r: any) => ({
            id: r._id,
            nombre: r.nombre,
            fechaCreacion: new Date(r.fechaCreacion || r.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
            descripcion: r.descripcion,
            deshabilitada: r.deshabilitada || false,
            direccion: r.direccion,
            ciudad: r.ciudad,
            codigoPostal: r.codigoPostal,
            precioNoche: r.precio,
            numeroHabitaciones: r.capacidad,
            numeroBanos: r.numeroBanos
          }));
          this.habitacionesFiltradas = this.habitaciones;
        }
      },
      error: (err) => console.error('Error cargando habitaciones:', err)
    });
  }

  buscarHabitaciones() {
    if (!this.busqueda.trim()) {
      this.habitacionesFiltradas = this.habitaciones;
      return;
    }
    const termino = this.busqueda.toLowerCase();
    this.habitacionesFiltradas = this.habitaciones.filter(h =>
      h.nombre.toLowerCase().includes(termino) ||
      h.descripcion.toLowerCase().includes(termino)
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
    if (habitacion) habitacion.deshabilitada = !habitacion.deshabilitada;
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
      if (numeroImagen === 1) this.formulario.imagen1 = file.name;
      else if (numeroImagen === 2) this.formulario.imagen2 = file.name;
      else if (numeroImagen === 3) this.formulario.imagen3 = file.name;
    }
  }

  guardarHabitacion() {
    if (!this.validarFormulario()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const usuario = this.authService.getUsuarioActual();
    if (!usuario || !usuario.id) {
      alert('Necesitas iniciar sesión para crear una habitación');
      return;
    }

    const payload: any = {
      nombre: this.formulario.nombre,
      descripcion: this.formulario.descripcion,
      precio: this.formulario.precioNoche,
      capacidad: this.formulario.numeroHabitaciones,
      direccion: this.formulario.direccion,
      ciudad: this.formulario.ciudad,
      codigoPostal: this.formulario.codigoPostal,
      imagenes: [this.formulario.imagen1, this.formulario.imagen2, this.formulario.imagen3].filter(Boolean),
      usuario: usuario.id
    };

    this.habitacionService.crearHabitacion(payload).subscribe({
      next: (res) => {
        if (res.success) {
          const r = res.data;
          const nueva = {
            id: r._id,
            nombre: r.nombre,
            fechaCreacion: new Date(r.fechaCreacion || r.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
            descripcion: r.descripcion,
            deshabilitada: r.deshabilitada || false,
            direccion: r.direccion,
            ciudad: r.ciudad,
            codigoPostal: r.codigoPostal,
            precioNoche: r.precio,
            numeroHabitaciones: r.capacidad,
            numeroBanos: r.numeroBanos
          };
          this.habitaciones.unshift(nueva);
          this.buscarHabitaciones();
          this.cerrarFormulario();
          alert('Habitación creada exitosamente');
        } else {
          alert(res.message || 'Error al crear la habitación');
        }
      },
      error: (err) => {
        console.error('Error al crear habitación:', err);
        alert('Error al conectar con el servidor');
      }
    });
  }

  volverInicio() {
    window.location.href = '/';
  }

  toggleMenuPerfil() {
    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
  }

  irAPerfil() {
    console.log('Ir a perfil');
  }

  irAConfiguracion() {
    console.log('Ir a configuración');
  }

  cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.cerrarSesion();
    }
  }
}
