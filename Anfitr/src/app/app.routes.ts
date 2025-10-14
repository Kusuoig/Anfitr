import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';
import { Acercade } from './components/acercade/acercade';
import { Contacto } from './components/contacto/contacto';

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
  { path: '**',
    component: Inicio
  }

];
