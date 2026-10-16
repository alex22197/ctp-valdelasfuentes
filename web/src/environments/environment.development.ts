import type { Entorno } from './entorno.interface';

/**
 * Configuración para `npm start`. De momento apunta al mismo proyecto de Supabase que
 * producción; ver docs/entorno-local.md para trabajar con una base de datos de desarrollo.
 */
export const environment: Entorno = {
  produccion: false,
  supabase: {
    url: 'https://wqnelcngcnubwtymnmjk.supabase.co',
    publishableKey: 'sb_publishable_23rZ2NXNtz3dKFm5SiP4ZA_DO3n5nwp',
  },
  // En local no se mide nada: las visitas de desarrollo ensuciarían las cifras.
  idAnalitica: null,
};
