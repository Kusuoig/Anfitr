import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html'
})
export class ConfiguracionComponent implements OnInit {
  usuario: Usuario | null = null;
  
  // Datos del formulario
  nombre: string = '';
  email: string = '';
  telefono: string = '';
  passwordActual: string = '';
  passwordNueva: string = '';
  passwordConfirmar: string = '';
  
  // Estados
  guardando: boolean = false;
  mostrarAlerta: boolean = false;
  tipoAlerta: 'success' | 'error' = 'success';
  mensajeAlerta: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuario = this.authService.getUsuarioActual();
    if (this.usuario) {
      this.nombre = this.usuario.nombre || '';
      this.email = this.usuario.email || '';
      this.telefono = this.usuario.telefono || '';
    }
  }

  guardarCambios() {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;

    const datosActualizar: any = {
      nombre: this.nombre,
      telefono: this.telefono
    };

    // Si se está cambiando la contraseña
    if (this.passwordNueva) {
      datosActualizar.passwordActual = this.passwordActual;
      datosActualizar.passwordNueva = this.passwordNueva;
    }

    this.http.put(`${environment.apiUrl}/users/${this.usuario?.id}`, datosActualizar)
      .subscribe({
        next: (response: any) => {
          this.guardando = false;
          if (response.success) {
            // Actualizar usuario en el servicio
            const usuarioActualizado = { ...this.usuario, ...response.data };
            this.authService.usuarioActual$.subscribe(u => {
              if (u) {
                localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));
              }
            });
            
            this.mostrarAlertaExito('Configuración actualizada exitosamente');
            this.limpiarPasswordFields();
          } else {
            this.mostrarAlertaError(response.message || 'Error al actualizar');
          }
        },
        error: (error) => {
          this.guardando = false;
          this.mostrarAlertaError(error.error?.message || 'Error al actualizar la configuración');
        }
      });
  }

  validarFormulario(): boolean {
    if (!this.nombre.trim()) {
      this.mostrarAlertaError('El nombre es requerido');
      return false;
    }

    if (!this.email.trim()) {
      this.mostrarAlertaError('El email es requerido');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.mostrarAlertaError('Email inválido');
      return false;
    }

    // Si se está cambiando password
    if (this.passwordNueva || this.passwordConfirmar) {
      if (!this.passwordActual) {
        this.mostrarAlertaError('Ingrese su contraseña actual');
        return false;
      }

      if (this.passwordNueva !== this.passwordConfirmar) {
        this.mostrarAlertaError('Las contraseñas nuevas no coinciden');
        return false;
      }

      if (this.passwordNueva.length < 6) {
        this.mostrarAlertaError('La contraseña debe tener al menos 6 caracteres');
        return false;
      }
    }

    return true;
  }

  limpiarPasswordFields() {
    this.passwordActual = '';
    this.passwordNueva = '';
    this.passwordConfirmar = '';
  }

  mostrarAlertaExito(mensaje: string) {
    this.tipoAlerta = 'success';
    this.mensajeAlerta = mensaje;
    this.mostrarAlerta = true;
    setTimeout(() => this.cerrarAlerta(), 3000);
  }

  mostrarAlertaError(mensaje: string) {
    this.tipoAlerta = 'error';
    this.mensajeAlerta = mensaje;
    this.mostrarAlerta = true;
  }

  cerrarAlerta() {
    this.mostrarAlerta = false;
  }

  volver() {
    this.router.navigate(['/inicio']);
  }
}
