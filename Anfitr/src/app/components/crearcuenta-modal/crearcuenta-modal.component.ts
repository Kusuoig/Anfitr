import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crearcuenta-modal.component.html',
  styles: []
})
export class RegisterModalComponent {
  showPassword = false;
  
  // Campos del formulario
  nombre: string = '';
  email: string = '';
  telefono: string = '';
  nombreUsuario: string = '';
  password: string = '';
  
  // Mensajes
  errorMessage: string = '';
  successMessage: string = '';
  
  // Estado de carga
  isLoading: boolean = false;

  constructor(
    private modalService: ModalService,
    private authService: AuthService
  ) {}

  switchToLogin() {
    this.modalService.openLogin();
  }

  register() {
    // Limpiar mensajes previos
    this.errorMessage = '';
    this.successMessage = '';

    // Validar campos requeridos
    if (!this.nombre || !this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios';
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor, ingresa un email válido';
      return;
    }

    // Validar longitud de contraseña
    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    // Validar teléfono si se proporciona
    if (this.telefono && this.telefono.length < 10) {
      this.errorMessage = 'Por favor, ingresa un número de teléfono válido';
      return;
    }

    // Preparar datos del usuario
    const userData = {
      nombre: this.nombre.trim(),
      email: this.email.trim().toLowerCase(),
      password: this.password,
      telefono: this.telefono.trim() || undefined,
      nombreUsuario: this.nombreUsuario.trim() || undefined,
      rol: 'guest' as const // Por defecto todos son guest
    };

    // Activar estado de carga
    this.isLoading = true;

    // Llamar al servicio de registro
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          // Registro exitoso
          this.successMessage = '¡Cuenta creada exitosamente!';
          
          // Limpiar formulario
          this.nombre = '';
          this.email = '';
          this.telefono = '';
          this.nombreUsuario = '';
          this.password = '';
          
          // Cerrar modal después de 1 segundo
          setTimeout(() => {
            this.modalService.close();
            console.log('Usuario registrado y logueado automáticamente');
          }, 1000);
        } else {
          // Registro fallido
          this.errorMessage = response.message || 'Error al crear la cuenta';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en registro:', error);
        this.errorMessage = 'Error al conectar con el servidor. Por favor, intenta de nuevo.';
      }
    });
  }
}