import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-detalles-cuarto',
  standalone: true,
  imports: [CommonModule, Footer, Navbar],
  templateUrl: './detalles-cuarto.html'
})
export class DetallesCuarto implements OnInit {
  propiedad: any = null;
  otrasProPiedades: any[] = [];
  habitacionId: string = ''; // ObjectId real de MongoDB

  // Mapeo de imágenes bonitas
  imagenesMap: { [key: string]: string[] } = {
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

  imagenes: string[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.habitacionId = id; // Guardar el ObjectId real
        this.cargarHabitacion(id);
      }
    });
    
    // Cargar otras habitaciones para mostrar
    this.cargarOtrasHabitaciones();
  }

  cargarHabitacion(id: string) {
    this.http.get<any>(`${environment.apiUrl}/rooms/${id}`).subscribe({
      next: (response) => {
        const habitacion = response.data;
        let imgUrl: string;
        let imagenes: string[];
        
        // Si tiene imágenes en la BD (uploads), usar esas
        if (habitacion.imagenes && habitacion.imagenes.length > 0) {
          imgUrl = `http://localhost:3000/${habitacion.imagenes[0]}`;
          imagenes = habitacion.imagenes.map((img: string) => `http://localhost:3000/${img}`);
        } else {
          // Si no, usar el mapeo de imágenes bonitas
          const imagenesBonitas = this.imagenesMap[habitacion.nombre] || [];
          imgUrl = imagenesBonitas[0] || 'https://via.placeholder.com/800x600';
          imagenes = imagenesBonitas.length > 0 ? imagenesBonitas : [imgUrl];
        }
        
        this.propiedad = {
          _id: habitacion._id,
          titulo: habitacion.nombre,
          ubicacion: habitacion.ciudad || 'Lakeside, ID 1234',
          precio: habitacion.precio,
          descripcion: habitacion.descripcion || 'Hermosa habitación con todas las comodidades',
          imgUrl: imgUrl
        };
        
        this.imagenes = imagenes;
      },
      error: (err) => {
        console.error('Error al cargar habitación:', err);
        this.router.navigate(['/inicio']);
      }
    });
  }

  cargarOtrasHabitaciones() {
    this.http.get<any>(`${environment.apiUrl}/rooms`).subscribe({
      next: (response) => {
        const habitaciones = response.data || response;
        
        this.otrasProPiedades = habitaciones.slice(0, 4).map((habitacion: any, index: number) => {
          let imgUrl: string;
          
          // Si tiene imágenes en la BD (uploads), usar esas
          if (habitacion.imagenes && habitacion.imagenes.length > 0) {
            imgUrl = `http://localhost:3000/${habitacion.imagenes[0]}`;
          } else {
            // Si no, usar el mapeo de imágenes bonitas
            const imagenes = this.imagenesMap[habitacion.nombre] || [];
            imgUrl = imagenes[index % imagenes.length] || 'https://via.placeholder.com/300x200';
          }
          
          return {
            _id: habitacion._id,
            titulo: habitacion.nombre,
            ubicacion: habitacion.ciudad || 'Lakeside, ID 1234',
            imgUrl: imgUrl,
            precio: habitacion.precio,
            descripcion: habitacion.descripcion || 'Hermosa habitación'
          };
        });
      },
      error: (err) => {
        console.error('Error al cargar otras habitaciones:', err);
      }
    });
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
  }

  verDetalles(propiedadId: string) { // <-- Ahora recibe string (_id)
    this.router.navigate(['/detalles-cuarto'], { queryParams: { id: propiedadId } });
  }

  irAPagos() {
    if (this.propiedad && this.habitacionId) {
      this.router.navigate(['/reserva-paso1'], {
        queryParams: {
          id: this.habitacionId, // <-- Usar el ObjectId real guardado
          titulo: this.propiedad.titulo,
          ubicacion: this.propiedad.ubicacion,
          precio: this.propiedad.precio,
          imgUrl: this.propiedad.imgUrl
        }
      });
    }
  }
}
