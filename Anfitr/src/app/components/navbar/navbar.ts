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
  mostrarMenuPerfil: boolean = false;

  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    private router: Router
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

  toggleMenuPerfil() {
    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
  }

  irAPerfil() {
    this.mostrarMenuPerfil = false;
    // Navegar a perfil según el rol
    if (this.usuarioActual?.rol === 'host') {
      this.router.navigate(['/mis-habitaciones']);
    } else {
      this.router.navigate(['/reservas']);
    }
  }

  irAConfiguracion() {
    this.mostrarMenuPerfil = false;
    console.log('Ir a configuración');
    // this.router.navigate(['/configuracion']);
  }

  cerrarSesion() {
    this.mostrarMenuPerfil = false;
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }
}
