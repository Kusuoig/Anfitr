import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) { }

  procesarPago(datosPago: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/procesar`, datosPago);
  }

  obtenerTarjetasPrueba(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tarjetas-prueba`);
  }

  crearTarjetaPrueba(tarjeta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-tarjeta-prueba`, tarjeta);
  }
}
