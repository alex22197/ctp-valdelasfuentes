import type { Entorno } from './entorno.interface';

/**
 * Configuración de producción. La publishable key es pública por diseño:
 * lo que protege los datos son las reglas de acceso (RLS) de la base de datos.
 */
export const environment: Entorno = {
  produccion: true,
  supabase: {
    url: 'https://wqnelcngcnubwtymnmjk.supabase.co',
    publishableKey: 'sb_publishable_23rZ2NXNtz3dKFm5SiP4ZA_DO3n5nwp',
  },
};
