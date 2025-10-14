import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-modal.component.html',
  styles: []
})
export class LoginModalComponent {
  showPassword = false;

  constructor(private modalService: ModalService) {}

  switchToRegister() {
    this.modalService.openRegister();
  }
}