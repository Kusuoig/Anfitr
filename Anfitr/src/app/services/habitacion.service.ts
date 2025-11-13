import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HabitacionService {
  private apiUrl = 'http://localhost:3000/api/rooms'; // o URL de tu backend

  constructor(private http: HttpClient) {}

  crearHabitacion(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getMisHabitaciones(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${userId}`);
  }
}
