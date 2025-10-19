import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { ModalService } from '../../services/modal.service';
interface menuItem {
  name: string;
  path: string;
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
 menuList: menuItem[] = [
    { name: 'Inicio', path: 'inicio' },
    { name: 'Acerca de', path: 'acercade' },
    { name: 'Contacto', path: 'contacto' },
  ];

  constructor(private modalService: ModalService) {}

  openLoginModal() {
    this.modalService.openLogin();
  }
}