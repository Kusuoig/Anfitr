import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HabitacionService {
  private apiUrl = 'http://localhost:3000/api/rooms';

  constructor(private http: HttpClient) {}

  crearHabitacion(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  actualizarHabitacion(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  eliminarHabitacion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getMisHabitaciones(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${userId}`);
  }

  obtenerHabitaciones(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  obtenerHabitacion(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
