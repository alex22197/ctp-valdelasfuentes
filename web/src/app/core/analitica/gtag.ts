declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

type ParametrosGtag = Record<string, unknown>;

/**
 * Las órdenes para Google Analytics, que gtag.js recoge de `window.dataLayer` cuando carga. Va
 * en el código de la web y no en un `<script>` dentro del HTML porque la política de contenido
 * no deja ejecutar scripts en línea.
 */
export function gtag(orden: 'js', fecha: Date): void;
export function gtag(orden: 'config', id: string, parametros: ParametrosGtag): void;
export function gtag(orden: 'set', parametros: ParametrosGtag): void;
export function gtag(orden: 'event', nombre: string, parametros?: ParametrosGtag): void;
export function gtag(
  orden: 'consent',
  tipo: 'default' | 'update',
  parametros: ParametrosGtag,
): void;
export function gtag(): void {
  // eslint-disable-next-line prefer-rest-params -- gtag.js descarta los arrays: espera `arguments`
  (window.dataLayer ??= []).push(arguments);
}

/**
 * El interruptor oficial de Google Analytics: mientras está puesto, gtag.js no manda nada, ni
 * siquiera los avisos sin cookies que el modo de consentimiento envía tras rechazar.
 */
export function silenciarGoogleAnalytics(id: string, silenciado: boolean): void {
  (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = silenciado;
}
