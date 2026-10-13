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
    path: 'convocatoria/:idConfrontacion',
    title: 'Convocatoria',
    canActivate: [gestorGuard],
    loadComponent: () =>
      import('@features/convocatoria/pages/convocatoria-page/convocatoria-page.component').then(
        (m) => m.ConvocatoriaPageComponent,
      ),
  },
  {
    path: 'gestion',
    title: 'Gestión',
    canActivate: [gestorGuard],
    loadComponent: () =>
      import('@features/gestion/pages/gestion-page/gestion-page.component').then(
        (m) => m.GestionPageComponent,
      ),
  },
  {
    path: 'estadisticas',
    title: 'Estadísticas',
    loadComponent: () =>
      import('@features/estadisticas/pages/estadisticas-page/estadisticas-page.component').then(
        (m) => m.EstadisticasPageComponent,
      ),
  },
  {
    path: 'plantilla',
    title: 'Plantilla',
    loadComponent: () =>
      import('@features/plantilla/pages/plantilla-page/plantilla-page.component').then(
        (m) => m.PlantillaPageComponent,
      ),
  },
  {
    path: 'jugadores/:idJugador',
    title: 'Jugador',
    loadComponent: () =>
      import('@features/ficha-jugador/pages/ficha-jugador-page/ficha-jugador-page.component').then(
        (m) => m.FichaJugadorPageComponent,
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
