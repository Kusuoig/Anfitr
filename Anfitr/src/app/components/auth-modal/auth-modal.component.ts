import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, ModalType } from '../../services/modal.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="currentModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      (click)="onBackdropClick($event)"
    >
      <div 
        class="relative bg-white rounded-lg shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        (click)="$event.stopPropagation()"
      >
        <!-- Botón cerrar -->
        <button
          (click)="closeModal()"
          class="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Contenido del modal -->
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class AuthModalComponent implements OnInit {
  currentModal: ModalType = null;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.modalState$.subscribe(state => {
      this.currentModal = state;
    });
  }

  closeModal() {
    this.modalService.close();
  }

  onBackdropClick(event: MouseEvent) {
    this.closeModal();
  }
}