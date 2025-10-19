import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  fotoPerfil: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuariosMock: Usuario[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      password: '123456',
      fotoPerfil: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 2,
      nombre: 'María González',
      email: 'maria@example.com',
      password: '123456',
      fotoPerfil: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 3,
      nombre: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      password: '123456',
      fotoPerfil: 'https://i.pravatar.cc/150?img=33'
    }
  ];

  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Verificar si hay un usuario guardado en localStorage solo en el navegador
    if (this.isBrowser) {
      const usuarioGuardado = localStorage.getItem('usuarioActual');
      if (usuarioGuardado) {
        this.usuarioActualSubject.next(JSON.parse(usuarioGuardado));
      }
    }
  }

  login(email: string, password: string): boolean {
    const usuario = this.usuariosMock.find(
      u => u.email === email && u.password === password
    );

    if (usuario) {
      this.usuarioActualSubject.next(usuario);
      if (this.isBrowser) {
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
      }
      return true;
    }

    return false;
  }

  logout(): void {
    this.usuarioActualSubject.next(null);
    if (this.isBrowser) {
      localStorage.removeItem('usuarioActual');
    }
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }

  estaLogueado(): boolean {
    return this.usuarioActualSubject.value !== null;
  }
}
