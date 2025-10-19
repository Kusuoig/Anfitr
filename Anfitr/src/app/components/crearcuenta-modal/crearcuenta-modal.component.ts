import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crearcuenta-modal.component.html',
  styles: []
})
export class RegisterModalComponent {
  showPassword = false;

  constructor(private modalService: ModalService) {}

  switchToLogin() {
    this.modalService.openLogin();
  }
}