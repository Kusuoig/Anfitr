import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';
import { Acercade } from './components/acercade/acercade';
import { Contacto } from './components/contacto/contacto';
import { DetallesCuarto } from './components/detalles-cuarto/detalles-cuarto';
import { ReservaPaso1 } from './components/reserva-paso1/reserva-paso1';
import { ReservaPaso2 } from './components/reserva-paso2/reserva-paso2';
import { ReservaConfirmacion } from './components/reserva-paso3/reserva-confirmacion';

export const routes: Routes = [
  { path: 'inicio',
    component: Inicio
  },
  { path: 'acercade',
    component: Acercade
  },
  {
    path: 'contacto',
    component: Contacto
  },
  {
    path: 'detalles-cuarto',
    component: DetallesCuarto
  },
  {
    path: 'reserva-paso1',
    component: ReservaPaso1
  },
  {
    path: 'reserva-paso2',
    component: ReservaPaso2
  },
  {
    path: 'reserva-confirmacion',
    component: ReservaConfirmacion
  },
  { path: '**',
    component: Inicio
  }

];
