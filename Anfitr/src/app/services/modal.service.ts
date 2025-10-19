import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ModalType = 'login' | 'register' | null;

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalState = new BehaviorSubject<ModalType>(null);
  public modalState$ = this.modalState.asObservable();

  openLogin() {
    this.modalState.next('login');
  }

  openRegister() {
    this.modalState.next('register');
  }

  close() {
    this.modalState.next(null);
  }

  isOpen(): boolean {
    return this.modalState.value !== null;
  }
}