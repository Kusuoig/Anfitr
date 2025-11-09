import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styles: []
})
export class LoginModalComponent {
  showPassword = false;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private modalService: ModalService,
    private authService: AuthService
  ) {}

  switchToRegister() {
    this.modalService.openRegister();
  }

  login() {
    // Limpiar mensaje de error previo
    this.errorMessage = '';

    // Validar campos
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    // Llamar al servicio de autenticación
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          // Login exitoso
          this.modalService.close();
          this.email = '';
          this.password = '';
          this.errorMessage = '';
          
          // Redirigir al dashboard o página principal
          console.log('Login exitoso');
        } else {
          // Login fallido
          this.errorMessage = response.message || 'Usuario o contraseña incorrectos';
        }
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessage = 'Error al conectar con el servidor. Por favor, intenta de nuevo.';
      }
    });
  }
}
