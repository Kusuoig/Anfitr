import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) { }

  obtenerReservasUsuario(usuarioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  crearReserva(reserva: any): Observable<any> {
    return this.http.post(this.apiUrl, reserva);
  }

  cancelarReserva(reservaId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reservaId}/cancelar`, {});
  }
}
