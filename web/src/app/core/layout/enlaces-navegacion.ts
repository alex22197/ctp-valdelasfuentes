import type { EnlaceNavegacion } from './interfaces/enlace-navegacion.interface';

/** Menú principal, compartido por la cabecera (escritorio) y la barra inferior (móvil). */
export const ENLACES_NAVEGACION: readonly EnlaceNavegacion[] = [
  { ruta: '/', etiqueta: 'Inicio', icono: 'inicio', coincidenciaExacta: true },
  {
    ruta: '/clasificacion',
    etiqueta: 'Clasificación',
    icono: 'clasificacion',
    coincidenciaExacta: false,
  },
];
