/** Quién somos, por si la liga mira sus registros. */
const AGENTE = 'ctp-valdelasfuentes-scraper (+https://ctp-valdelasfuentes.padel-ctp.workers.dev)';
const TIEMPO_MAXIMO_MS = 20_000;

/** Descarga una página de la web de la liga: una petición, sin reintentos ni seguimiento. */
export async function descargarPagina(url: string): Promise<string> {
  const respuesta = await fetch(url, {
    headers: { 'user-agent': AGENTE, accept: 'text/html' },
    signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
  });
  if (!respuesta.ok) {
    throw new Error(`La liga ha respondido ${respuesta.status} a ${url}`);
  }
  return respuesta.text();
}
