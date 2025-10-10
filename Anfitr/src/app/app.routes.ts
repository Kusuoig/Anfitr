import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio';
import { Acercade } from './components/acercade/acercade';
import { Contacto } from './components/contacto/contacto';
import { LoginComponent } from './components/login/login.component';
import { CrearcuentaComponent } from './components/crearcuenta/crearcuenta.component';

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
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'crearcuenta',
    component: CrearcuentaComponent
  },
  { path: '**',
    component: Inicio
  }

];
