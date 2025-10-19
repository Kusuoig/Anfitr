import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { RegisterModalComponent } from './components/crearcuenta-modal/crearcuenta-modal.component';
import { RegistrarDepartamento } from './components/registrar-departamento/registrar-departamento';
import { ConfirmacionModal } from './components/confirmacion-modal/confirmacion-modal';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Navbar,
    AuthModalComponent,
    LoginModalComponent,
    RegisterModalComponent,
    RegistrarDepartamento,
    ConfirmacionModal
  ],
  templateUrl: './app.html'
})
export class AppComponent {
  constructor(public modalService: ModalService) {}
}
