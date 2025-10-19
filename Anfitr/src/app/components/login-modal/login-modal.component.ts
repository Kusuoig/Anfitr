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
    const success = this.authService.login(this.email, this.password);

    if (success) {
      this.modalService.close();
      this.email = '';
      this.password = '';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
}
