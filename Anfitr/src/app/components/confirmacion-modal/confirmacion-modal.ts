import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-confirmacion-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmacion-modal.html'
})
export class ConfirmacionModal {
  constructor(
    private modalService: ModalService,
    private router: Router
  ) {}

  cerrarYVolverInicio() {
    this.modalService.close();
    this.router.navigate(['/inicio']);
  }
}
