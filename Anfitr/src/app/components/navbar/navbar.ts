import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { AuthService, Usuario } from '../../services/auth.service';
interface menuItem {
  name: string;
  path: string;
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html'
})
export class Navbar implements OnInit {
 menuList: menuItem[] = [
    { name: 'Inicio', path: 'inicio' },
    { name: 'Acerca de', path: 'acercade' },
    { name: 'Contacto', path: 'contacto' },
  ];

  usuarioActual: Usuario | null = null;
  isMobileMenuOpen: boolean = false;

  constructor(
    private modalService: ModalService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.usuarioActual$.subscribe(usuario => {
      this.usuarioActual = usuario;
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  openLoginModal() {
    this.modalService.openLogin();
  }

  irAPerfil() {
    console.log('Ir a perfil - Sin funcionalidad');
  }

  cerrarSesion() {
    this.authService.logout();
  }
}
