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
  activa: boolean;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  precioNoche?: number;
  numeroHabitaciones?: number;
  numeroBanos?: number;
  imagenes?: string[];
  imagenPrincipal?: string;
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
  imagen1: File | null;
  imagen2: File | null;
  imagen3: File | null;
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
    imagen1: null,
    imagen2: null,
    imagen3: null
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
            activa: r.activa !== undefined ? r.activa : true,
            direccion: r.direccion,
            ciudad: r.ciudad,
            codigoPostal: r.codigoPostal,
            precioNoche: r.precio,
            numeroHabitaciones: r.capacidad,
            numeroBanos: r.numeroBanos,
            imagenes: r.imagenes || [],
            imagenPrincipal: r.imagenes && r.imagenes.length > 0 ? `http://localhost:3000/${r.imagenes[0]}` : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
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
        imagen1: null,
        imagen2: null,
        imagen3: null
      };
      this.mostrarFormulario = true;
    }
  }

  eliminarHabitacion(habitacionId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta habitación?')) {
      this.habitacionService.eliminarHabitacion(habitacionId).subscribe({
        next: (res) => {
          if (res.success) {
            this.habitaciones = this.habitaciones.filter(h => h.id !== habitacionId);
            this.buscarHabitaciones();
            alert('Habitación eliminada correctamente');
          }
        },
        error: (err) => {
          console.error('Error al eliminar habitación:', err);
          alert('Error al eliminar la habitación');
        }
      });
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
      imagen1: null,
      imagen2: null,
      imagen3: null
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
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona solo imágenes');
        return;
      }
      if (numeroImagen === 1) this.formulario.imagen1 = file;
      else if (numeroImagen === 2) this.formulario.imagen2 = file;
      else if (numeroImagen === 3) this.formulario.imagen3 = file;
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

    // Crear FormData para enviar archivos
    const formData = new FormData();
    formData.append('nombre', this.formulario.nombre);
    formData.append('descripcion', this.formulario.descripcion);
    formData.append('precio', this.formulario.precioNoche!.toString());
    formData.append('capacidad', this.formulario.numeroHabitaciones!.toString());
    formData.append('numeroBanos', this.formulario.numeroBanos!.toString());
    formData.append('direccion', this.formulario.direccion);
    formData.append('ciudad', this.formulario.ciudad);
    formData.append('codigoPostal', this.formulario.codigoPostal);
    formData.append('usuario', usuario.id);

    // Agregar imágenes si existen
    if (this.formulario.imagen1) formData.append('imagenes', this.formulario.imagen1);
    if (this.formulario.imagen2) formData.append('imagenes', this.formulario.imagen2);
    if (this.formulario.imagen3) formData.append('imagenes', this.formulario.imagen3);

    // Si estamos en modo edición, actualizar; si no, crear
    if (this.modoEdicion && this.habitacionEditando) {
      this.habitacionService.actualizarHabitacion(this.habitacionEditando, formData).subscribe({
        next: (res) => {
          if (res.success) {
            // Actualizar en la lista local
            const index = this.habitaciones.findIndex(h => h.id === this.habitacionEditando);
            if (index !== -1) {
              const r = res.data;
              this.habitaciones[index] = {
                id: r._id,
                nombre: r.nombre,
                fechaCreacion: new Date(r.fechaCreacion || r.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
                descripcion: r.descripcion,
                deshabilitada: r.deshabilitada || false,
                activa: r.activa !== undefined ? r.activa : true,
                direccion: r.direccion,
                ciudad: r.ciudad,
                codigoPostal: r.codigoPostal,
                precioNoche: r.precio,
                numeroHabitaciones: r.capacidad,
                numeroBanos: r.numeroBanos
              };
            }
            this.buscarHabitaciones();
            this.cerrarFormulario();
            alert('Habitación actualizada exitosamente');
          } else {
            alert(res.message || 'Error al actualizar la habitación');
          }
        },
        error: (err) => {
          console.error('Error al actualizar habitación:', err);
          alert('Error al conectar con el servidor');
        }
      });
    } else {
      this.habitacionService.crearHabitacion(formData).subscribe({
        next: (res) => {
          if (res.success) {
            const r = res.data;
            const nueva = {
              id: r._id,
              nombre: r.nombre,
              fechaCreacion: new Date(r.fechaCreacion || r.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
              descripcion: r.descripcion,
              deshabilitada: r.deshabilitada || false,
              activa: r.activa !== undefined ? r.activa : true,
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
