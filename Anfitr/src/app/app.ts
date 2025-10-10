import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {
  //Ocultar Navbar en login y crearcuenta
  showNavbar = signal(true); // Usar signal para reactividad

  constructor(private router: Router) {
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Lista de rutas donde NO se muestra la navbar
      const hiddenRoutes = ['/login', '/crearcuenta'];
      
      // Actualizar el signal
      this.showNavbar.set(!hiddenRoutes.includes(event.url));
    });
  }
}