import type { Routes } from '@angular/router';
import { gestorGuard } from '@core/auth/gestor.guard';

/**
 * Rutas de la aplicación. Cada página se carga solo cuando se visita (carga diferida).
 * El `title` se completa con el nombre del sitio en `TituloPaginaStrategy`.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/inicio/pages/inicio-page/inicio-page.component').then(
        (m) => m.InicioPageComponent,
      ),
  },
  {
    path: 'clasificacion',
    title: 'Clasificación',
    loadComponent: () =>
      import('@features/clasificacion/pages/clasificacion-page/clasificacion-page.component').then(
        (m) => m.ClasificacionPageComponent,
      ),
  },
  {
    path: 'resultados/:idConfrontacion',
    title: 'Resultados',
    canActivate: [gestorGuard],
    loadComponent: () =>
      import('@features/resultados/pages/resultados-confrontacion-page/resultados-confrontacion-page.component').then(
        (m) => m.ResultadosConfrontacionPageComponent,
      ),
  },
  {
    path: 'pasar-lista/:idConfrontacion',
    title: 'Pasar lista',
    canActivate: [gestorGuard],
    loadComponent: () =>
      import('@features/pasar-lista/pages/pasar-lista-page/pasar-lista-page.component').then(
        (m) => m.PasarListaPageComponent,
      ),
  },
  {
    path: 'convocatoria/:idConfrontacion',
    title: 'Convocatoria',
    canActivate: [gestorGuard],
    loadComponent: () =>
      import('@features/convocatoria/pages/convocatoria-page/convocatoria-page.component').then(
        (m) => m.ConvocatoriaPageComponent,
      ),
  },
  {
    path: 'reglamento',
    title: 'Reglamento',
    loadComponent: () =>
      import('@features/reglamento/pages/reglamento-page/reglamento-page.component').then(
        (m) => m.ReglamentoPageComponent,
      ),
  },
  {
    path: 'acceso',
    title: 'Acceso',
    loadComponent: () =>
      import('@features/acceso/pages/acceso-page/acceso-page.component').then(
        (m) => m.AccesoPageComponent,
      ),
  },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () =>
      import('@features/no-encontrado/pages/no-encontrado-page/no-encontrado-page.component').then(
        (m) => m.NoEncontradoPageComponent,
      ),
  },
];
