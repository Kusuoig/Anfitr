import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  fotoPerfil?: string;
  rol?: 'guest' | 'host' | 'admin';
  fechaRegistro?: Date;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Verificar si hay un usuario guardado en localStorage solo en el navegador
    if (this.isBrowser) {
      const usuarioGuardado = localStorage.getItem('usuarioActual');
      if (usuarioGuardado) {
        this.usuarioActualSubject.next(JSON.parse(usuarioGuardado));
      }
    }
  }

  login(email: string, password: string): Observable<{success: boolean, message?: string}> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, { email, password })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Guardar usuario en el estado y localStorage
            this.usuarioActualSubject.next(response.data);
            if (this.isBrowser) {
              localStorage.setItem('usuarioActual', JSON.stringify(response.data));
            }
            return { success: true };
          }
          return { success: false, message: response.message };
        }),
        catchError(error => {
          console.error('Error en login:', error);
          const message = error.error?.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.';
          return of({ success: false, message });
        })
      );
  }

  register(userData: {
    nombre: string;
    email: string;
    password: string;
    telefono?: string;
    nombreUsuario?: string;
    rol?: 'guest' | 'host' | 'admin';
  }): Observable<{success: boolean, message?: string, data?: Usuario}> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/register`, userData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Automáticamente loguear al usuario después del registro
            this.usuarioActualSubject.next(response.data);
            if (this.isBrowser) {
              localStorage.setItem('usuarioActual', JSON.stringify(response.data));
            }
            return { success: true, data: response.data };
          }
          return { success: false, message: response.message };
        }),
        catchError(error => {
          console.error('Error en registro:', error);
          const message = error.error?.message || 'Error al registrar usuario. Por favor, intenta de nuevo.';
          return of({ success: false, message });
        })
      );
  }

  logout(): void {
    this.usuarioActualSubject.next(null);
    if (this.isBrowser) {
      localStorage.removeItem('usuarioActual');
    }
  }

  cerrarSesion() {
    this.logout();
    console.log('Cerrando sesión...');
    // Redirigir al login
    if (this.isBrowser) {
      window.location.href = '/login';
    }
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }

  estaLogueado(): boolean {
    return this.usuarioActualSubject.value !== null;
  }
}
