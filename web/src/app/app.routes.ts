import type { Routes } from '@angular/router';

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
