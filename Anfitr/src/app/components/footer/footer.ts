import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html'
})
export class Footer {
  constructor(
    private modalService: ModalService,
    private authService: AuthService
  ) {}

  abrirRegistroDepartamento() {
    if (this.authService.estaLogueado()) {
      this.modalService.openRegistrarDepartamento();
    } else {
      this.modalService.openLogin();
    }
  }
}
