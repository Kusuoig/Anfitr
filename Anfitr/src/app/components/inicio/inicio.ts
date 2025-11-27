import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- IMPORTANTE para *ngIf y *ngFor
import { FormsModule } from '@angular/forms';   // <-- IMPORTANTE para [(ngModel)]
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Footer } from '../footer/footer';
import { Navbar } from '../navbar/navbar';
@Component({
  selector: 'app-inicio',
  // Aquí importamos los módulos que el HTML necesita
  imports: [
    CommonModule,
    FormsModule,
    Footer,
    Navbar
  ],
  standalone: true, // <-- Asegúrate de que esto esté aquí
  templateUrl: './inicio.html'
})
export class Inicio implements OnInit { // <-- Usando el nombre de tu clase

  // --- Lógica para el contador de Personas ---
  public contadorPersonas: number = 2;
  public mostrarContador: boolean = false;

  // --- Lógica para la Búsqueda ---
  public searchTerm: string = '';

  // Para que el filtro funcione, las propiedades deben ser un array de datos
  public propiedades: any[] = [];

  constructor(private elementRef: ElementRef, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.cargarHabitaciones();
  }

  cargarHabitaciones() {
    this.http.get<any>(`${environment.apiUrl}/rooms`).subscribe({
      next: (response) => {
        // La respuesta viene en formato { success: true, count: X, data: [...] }
        const habitaciones = response.data || response;
        
        // Mapeo de imágenes bonitas para cada habitación
        const imagenesMap: { [key: string]: string[] } = {
          'Shangri-La': [
            'https://www.palosantohotel.com/wp-content/uploads/2019/08/PaloSanto-PremiumRoom-1-1-scaled-e1623178720137.jpg',
            'https://preciadoshotel.com/wp-content/uploads/2024/11/O2A8620.jpg',
            'https://s3.amazonaws.com/static-webstudio-accorhotels-usa-1.wp-ha.fastbooking.com/wp-content/uploads/sites/25/2023/01/26154719/Pullman_miraflores_deluxe_king_slide1-370x276.jpg'
          ],
          'Top View': [
            'https://covive.mx/wp-content/uploads/2023/10/CUARTOS-EN-RENTA-CDMX.jpg',
            'https://www.palosantohotel.com/wp-content/uploads/2024/07/0-Premium-238a-3000px.jpg',
            'https://images.mirai.com/INFOROOMS/20755362/R8kpTbsLiyhu8t7gWUDc/R8kpTbsLiyhu8t7gWUDc_large.jpg'
          ],
          'Green Villa': [
            'https://cf.bstatic.com/xdata/images/hotel/max1024x768/470292656.jpg?k=ea89235887ff7b2167ac2ef35e35c324244524054638d33640cdbaf7e121591e&o=&hp=1',
            'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2024/11/04/1732/KULCT-P0027-King-Bed-Premium-Corner-Guest-Bedroom.jpg/KULCT-P0027-King-Bed-Premium-Corner-Guest-Bedroom.16x9.jpg',
            'https://www.hotelpalmastephe.com/images/habitacion-premium-hotel-palmas.jpg'
          ],
          'Wooden Pit': [
            'https://img10.naventcdn.com/avisos/18/01/46/29/35/60/360x266/1528407007.jpg?isFirstImage=true',
            'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/4e/e9/2a/vip-room-2.jpg?w=700&h=-1&s=1',
            'https://img.freepik.com/fotos-premium/diseno-moderno-dormitorio-lujo-muebles-blancos_1201528-11694.jpg?semt=ais_hybrid&w=740&q=80'
          ]
        };
        
        // Mapear las habitaciones de la BD al formato que usa el template
        let imgIndex = 0;
        this.propiedades = habitaciones.map((habitacion: any) => {
          let imgUrl: string;
          
          // Si tiene imágenes en la BD (uploads), usar esas
          if (habitacion.imagenes && habitacion.imagenes.length > 0) {
            imgUrl = `http://localhost:3000/${habitacion.imagenes[0]}`;
          } else {
            // Si no, usar el mapeo de imágenes bonitas
            const imagenes = imagenesMap[habitacion.nombre] || [];
            imgUrl = imagenes[imgIndex % imagenes.length] || 'https://via.placeholder.com/300x200';
            imgIndex++;
          }
          
          return {
            _id: habitacion._id, // <-- ID real de MongoDB
            titulo: habitacion.nombre,
            ubicacion: habitacion.ciudad || 'Lakeside, ID 1234',
            imgUrl: imgUrl,
            precio: habitacion.precio,
            descripcion: habitacion.descripcion,
            capacidad: habitacion.capacidad
          };
        });
      },
      error: (err) => {
        console.error('Error al cargar habitaciones:', err);
        this.propiedades = [];
      }
    });
  }

  // --- Métodos para el Contador ---

  toggleContador(event: Event) {
    event.stopPropagation(); // Evita que el clic se propague al documento
    this.mostrarContador = !this.mostrarContador;
  }

  incrementar() {
    this.contadorPersonas++;
  }

  decrementar() {
    if (this.contadorPersonas > 0) {
      this.contadorPersonas--;
    }
  }

  // --- Método para cerrar el dropdown si se hace clic fuera ---
  @HostListener('document:click', ['$event'])
  onClickFuera(event: Event) {
    // Si se hizo clic fuera del elemento raíz del componente
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.mostrarContador = false;
    }
  }

  // --- Método "get" para el filtro (se actualiza solo) ---
  get propiedadesFiltradas() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.propiedades; // Muestra todas si no hay búsqueda
    }

    // Filtra las propiedades basado en el título
    return this.propiedades.filter(prop =>
      prop.titulo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  verDetalles(propiedadId: string) { // <-- Ahora recibe string (_id de MongoDB)
    this.router.navigate(['/detalles-cuarto'], { queryParams: { id: propiedadId } });
  }
}

