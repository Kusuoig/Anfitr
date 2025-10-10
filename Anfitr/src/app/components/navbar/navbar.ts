import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
interface menuItem {
  name: string;
  path: string;
}
@Component({
  selector: 'app-navbar',
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
}
