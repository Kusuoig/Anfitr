import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-detalles-cuarto',
  standalone: true,
  imports: [CommonModule, Footer, Navbar],
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
      descripcion: 'Disfruta de una estancia inolvidable en esta elegante habitación con vistas panorámicas al lago. Decorada con piezas artesanales, cuenta con amenidades de lujo y un servicio personalizado para garantizar tu comodidad.',
      precio: 520
    },
    {
      id: 2,
      titulo: 'Top View',
      ubicacion: 'Lakeside, ID 1234',
      imgUrl: 'https://covive.mx/wp-content/uploads/2023/10/CUARTOS-EN-RENTA-CDMX.jpg',
      descripcion: 'Suite amplia con terraza privada y vistas impresionantes al atardecer. Equipada con mobiliario moderno, sistema de sonido integrado y baño de mármol con duchas de efecto lluvia.',
      precio: 540
    },
    {
      id: 3,
      titulo: 'Green Villa',
      ubicacion: 'Bogor, ID 2345',
      imgUrl: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/470292656.jpg?k=ea89235887ff7b2167ac2ef35e35c324244524054638d33640cdbaf7e121591e&o=&hp=1',
      descripcion: 'Acogedora villa rodeada de exuberante vegetación y jardines privados. Dispone de sala de estar abierta, cocina completa de diseño contemporáneo y un pequeño spa con jacuzzi exterior.',
      precio: 510
    },
    {
      id: 4,
      titulo: 'Wooden Pit',
      ubicacion: 'Wonosobo, ID 3456',
      imgUrl: 'https://img10.naventcdn.com/avisos/18/01/46/29/35/60/360x266/1528407007.jpg?isFirstImage=true',
      descripcion: 'Habitación rústica con detalles en madera noble y chimenea encendida para las noches frías. Disfruta de la tranquilidad del entorno y de la decoración inspirada en tradiciones locales.',
      precio: 530
    },
    {
      id: 5,
      titulo: 'Shangri-La',
      ubicacion: 'Lakeside, ID 1234',
      imgUrl: 'https://preciadoshotel.com/wp-content/uploads/2024/11/O2A8620.jpg',
      descripcion: 'Lujo clásico con mobiliario de época, textiles de seda y almohadas premium. Incluye servicio de mayordomo 24/7 y amenidades exclusivas de spa en la habitación.',
      precio: 550
    },
    {
      id: 6,
      titulo: 'Top View',
      ubicacion: 'Lakeside, ID 1234',
      imgUrl: 'https://www.palosantohotel.com/wp-content/uploads/2024/07/0-Premium-238a-3000px.jpg',
      descripcion: 'Suite moderna con ventanales de piso a techo, minibar surtido y sistema de entretenimiento de última generación. Ideal para viajes de negocios o escapadas románticas.',
      precio: 560
    },
    {
      id: 7,
      titulo: 'Green Villa',
      ubicacion: 'Bogor, ID 2345',
      imgUrl: 'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2024/11/04/1732/KULCT-P0027-King-Bed-Premium-Corner-Guest-Bedroom.jpg/KULCT-P0027-King-Bed-Premium-Corner-Guest-Bedroom.16x9.jpg',
      descripcion: 'Suite de esquina con jardín privado, terraza amueblada y sala de estar abierta. Dispone de cafetera de especialidad y acceso directo a senderos ecológicos del resort.',
      precio: 570
    },
    {
      id: 8,
      titulo: 'Wooden Pit',
      ubicacion: 'Wonosobo, ID 3456',
      imgUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/4e/e9/2a/vip-room-2.jpg?w=700&h=-1&s=1',
      descripcion: 'Ambiente cálido con muebles artesanales de madera y baño con hidromasaje. Perfecto para desconectar y disfrutar de la serenidad del bosque que rodea la propiedad.',
      precio: 580
    },
    {
      id: 9,
      titulo: 'Shangri-La',
      ubicacion: 'Lakeside, ID 1234',
      imgUrl: 'https://s3.amazonaws.com/static-webstudio-accorhotels-usa-1.wp-ha.fastbooking.com/wp-content/uploads/sites/25/2023/01/26154719/Pullman_miraflores_deluxe_king_slide1-370x276.jpg',
      descripcion: 'Diseño elegante con textiles de seda, baño de mármol y sistema de aromaterapia personalizado. Servicio de desayuno en la habitación y acceso a la piscina infinita sobre el lago.',
      precio: 590
    },
    {
      id: 10,
      titulo: 'Top View',
      ubicacion: 'Lakeside, ID 1234',
      imgUrl: 'https://images.mirai.com/INFOROOMS/20755362/R8kpTbsLiyhu8t7gWUDc/R8kpTbsLiyhu8t7gWUDc_large.jpg',
      descripcion: 'Decoración minimalista con líneas puras y vistas ininterrumpidas al valle. Incluye escritorio de trabajo ergonómico, Wi-Fi de alta velocidad y cafetera espresso.',
      precio: 600
    },
    {
      id: 11,
      titulo: 'Green Villa',
      ubicacion: 'Bogor, ID 2345',
      imgUrl: 'https://www.hotelpalmastephe.com/images/habitacion-premium-hotel-palmas.jpg',
      descripcion: 'Habitación premium con terraza privada, desayuno gourmet incluido y amenidades ecológicas. Dispone de minibar orgánico y selección de tés de la región.',
      precio: 610
    },
    {
      id: 12,
      titulo: 'Wooden Pit',
      ubicacion: 'Wonosobo, ID 3456',
      imgUrl: 'https://img.freepik.com/fotos-premium/diseno-moderno-dormitorio-lujo-muebles-blancos_1201528-11694.jpg?semt=ais_hybrid&w=740&q=80',
      descripcion: 'Estilo contemporáneo con iluminación suave, ducha amplia tipo lluvia y estación de café barista. Ideal para viajeros que buscan confort y diseño de vanguardia.',
      precio: 620
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
    if (this.propiedad) {
      this.router.navigate(['/reserva-paso1'], {
        queryParams: {
          id: this.propiedad.id,
          titulo: this.propiedad.titulo,
          ubicacion: this.propiedad.ubicacion,
          precio: this.propiedad.precio,
          imgUrl: this.propiedad.imgUrl
        }
      });
    }
  }
}
