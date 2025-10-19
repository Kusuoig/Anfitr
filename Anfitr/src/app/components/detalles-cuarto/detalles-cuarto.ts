import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-detalles-cuarto',
  standalone: true,
  imports: [CommonModule, Footer],
  templateUrl: './detalles-cuarto.html'
})
export class DetallesCuarto implements OnInit {
  propiedad: any;

  otrasProPiedades = [
    {
      id: 1,
      titulo: 'Shangri-La',
      ubicacion: 'Lakeside, ID 1234',
      imgUrl: 'https://www.palosantohotel.com/wp-content/uploads/2019/08/PaloSanto-PremiumRoom-1-1-scaled-e1623178720137.jpg',
      precio: 1200,
      descripcion: 'Hermoso cuarto con vista al lago, ideal para parejas o familias pequeñas. Cuenta con todas las comodidades modernas y un ambiente relajante.'
    },
    {
      id: 2,
      titulo: 'Top View',
      ubicacion: 'Lakeside, ID 1234',
      imgUrl: 'https://covive.mx/wp-content/uploads/2023/10/CUARTOS-EN-RENTA-CDMX.jpg',
      precio: 950,
      descripcion: 'Espacio acogedor con vistas increíbles desde el piso superior. Perfecto para quienes buscan tranquilidad y confort.'
    },
    {
      id: 3,
      titulo: 'Green Villa',
      ubicacion: 'Bogor, ID 2345',
      imgUrl: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/470292656.jpg?k=ea89235887ff7b2167ac2ef35e35c324244524054638d33640cdbaf7e121591e&o=&hp=1',
      precio: 1500,
      descripcion: 'Villa rodeada de naturaleza con amplios espacios verdes. Ideal para desconectar de la ciudad.'
    },
    {
      id: 4,
      titulo: 'Wooden Pit',
      ubicacion: 'Wonosobo, ID 3456',
      imgUrl: 'https://img10.naventcdn.com/avisos/18/01/46/29/35/60/360x266/1528407007.jpg?isFirstImage=true',
      precio: 800,
      descripcion: 'Cuarto acogedor con decoración en madera. Ambiente cálido y familiar en zona tranquila.'
    },
    {
      id: 5,
      titulo: 'Ocean Breeze',
      ubicacion: 'Lakeside, ID 1234',
      imgUrl: 'https://preciadoshotel.com/wp-content/uploads/2024/11/O2A8620.jpg',
      precio: 1350,
      descripcion: 'Habitación moderna con brisa marina. Perfecto para una escapada romántica.'
    },
    {
      id: 6,
      titulo: 'Mountain Lodge',
      ubicacion: 'Lakeside, ID 1234',
      imgUrl: 'https://www.palosantohotel.com/wp-content/uploads/2024/07/0-Premium-238a-3000px.jpg',
      precio: 1100,
      descripcion: 'Lodge en las montañas con vistas espectaculares. Ideal para amantes de la naturaleza.'
    },
    {
      id: 7,
      titulo: 'City Loft',
      ubicacion: 'Bogor, ID 2345',
      imgUrl: 'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2024/11/04/1732/KULCT-P0027-King-Bed-Premium-Corner-Guest-Bedroom.jpg/KULCT-P0027-King-Bed-Premium-Corner-Guest-Bedroom.16x9.jpg',
      precio: 1250,
      descripcion: 'Loft moderno en el corazón de la ciudad. Perfecto para viajeros de negocios.'
    },
    {
      id: 8,
      titulo: 'Sunset Paradise',
      ubicacion: 'Wonosobo, ID 3456',
      imgUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/4e/e9/2a/vip-room-2.jpg?w=700&h=-1&s=1',
      precio: 1600,
      descripcion: 'Cuarto de lujo con atardeceres inolvidables. Experiencia premium garantizada.'
    }
  ];

  imagenes = [
    'https://www.palosantohotel.com/wp-content/uploads/2019/08/PaloSanto-PremiumRoom-1-1-scaled-e1623178720137.jpg',
    'https://covive.mx/wp-content/uploads/2023/10/CUARTOS-EN-RENTA-CDMX.jpg',
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/470292656.jpg?k=ea89235887ff7b2167ac2ef35e35c324244524054638d33640cdbaf7e121591e&o=&hp=1'
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.propiedad = this.otrasProPiedades.find(p => p.id === parseInt(id));
        if (this.propiedad) {
          // Usar las imágenes específicas de la propiedad si están disponibles
          this.imagenes = [
            this.propiedad.imgUrl,
            this.propiedad.imgUrl,
            this.propiedad.imgUrl
          ];
        }
      }

      // Si no se encuentra propiedad, usar la primera por defecto
      if (!this.propiedad) {
        this.propiedad = this.otrasProPiedades[0];
      }
    });
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
  }

  verDetalles(propiedadId: number) {
    this.router.navigate(['/detalles-cuarto'], { queryParams: { id: propiedadId } });
  }

  irAPagos() {
    // Por ahora solo navega, no hay funcionalidad
    console.log('Ir a pagos - Sin funcionalidad');
  }
}
