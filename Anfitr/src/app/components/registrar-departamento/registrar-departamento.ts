import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-registrar-departamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-departamento.html'
})
export class RegistrarDepartamento {
  paso: number = 1;

  // Datos del formulario paso 1
  nombrePropiedad: string = '';
  direccion: string = '';
  ciudad: string = '';
  codigoPostal: string = '';
  descripcion: string = '';

  // Datos del formulario paso 2
  precioNoche: string = '';
  numeroHabitaciones: string = '';
  numeroBanos: string = '';
  imagen1: File | null = null;
  imagen2: File | null = null;
  imagen3: File | null = null;

  // Nombres de archivos para mostrar
  nombreImagen1: string = '';
  nombreImagen2: string = '';
  nombreImagen3: string = '';

  constructor(private modalService: ModalService) {}

  cerrarModal() {
    this.modalService.close();
    this.resetForm();
  }

  validarPaso1(): boolean {
    return this.nombrePropiedad !== '' &&
           this.direccion !== '' &&
           this.ciudad !== '' &&
           this.codigoPostal !== '' &&
           this.descripcion !== '';
  }

  siguientePaso() {
    if (this.validarPaso1()) {
      this.paso = 2;
    }
  }

  pasoAnterior() {
    this.paso = 1;
  }

  onFileSelected(event: any, numeroImagen: number) {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea imagen
      if (file.type.startsWith('image/')) {
        switch(numeroImagen) {
          case 1:
            this.imagen1 = file;
            this.nombreImagen1 = file.name;
            break;
          case 2:
            this.imagen2 = file;
            this.nombreImagen2 = file.name;
            break;
          case 3:
            this.imagen3 = file;
            this.nombreImagen3 = file.name;
            break;
        }
      } else {
        alert('Por favor selecciona solo imágenes');
      }
    }
  }

  validarPaso2(): boolean {
    return this.precioNoche !== '' &&
           this.numeroHabitaciones !== '' &&
           this.numeroBanos !== '' &&
           this.imagen1 !== null;
  }

  registrarDepartamento() {
    if (this.validarPaso2()) {
      console.log('Datos del departamento:', {
        nombrePropiedad: this.nombrePropiedad,
        direccion: this.direccion,
        ciudad: this.ciudad,
        codigoPostal: this.codigoPostal,
        descripcion: this.descripcion,
        precioNoche: this.precioNoche,
        numeroHabitaciones: this.numeroHabitaciones,
        numeroBanos: this.numeroBanos,
        imagenes: [this.nombreImagen1, this.nombreImagen2, this.nombreImagen3]
      });

      this.modalService.close();
      this.resetForm();
      this.modalService.openConfirmacion();
    }
  }

  resetForm() {
    this.paso = 1;
    this.nombrePropiedad = '';
    this.direccion = '';
    this.ciudad = '';
    this.codigoPostal = '';
    this.descripcion = '';
    this.precioNoche = '';
    this.numeroHabitaciones = '';
    this.numeroBanos = '';
    this.imagen1 = null;
    this.imagen2 = null;
    this.imagen3 = null;
    this.nombreImagen1 = '';
    this.nombreImagen2 = '';
    this.nombreImagen3 = '';
  }
}
