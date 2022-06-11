import { Routes } from '@angular/router';

import { KmeansComponent } from '../kmeans/kmeans.component';
import { HomeComponent } from '../home/home.component';
import { MetododelCodoComponent } from '../metododel-codo/metododel-codo.component';
import { ClasificacionComponent } from '../clasificacion/clasificacion.component';
import { EscoComponent } from '../esco/esco.component';

//Components

export const PANEL_ROUTES: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'kmeans', component: KmeansComponent },
  { path: 'MetododelCodo', component: MetododelCodoComponent },
  { path: 'Clasificacion', component: ClasificacionComponent },
  { path: 'esco', component: EscoComponent },  
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' },
  
];
