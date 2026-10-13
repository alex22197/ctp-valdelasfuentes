import { TestBed } from '@angular/core/testing';
import {
  ESPERA_ANTES_DE_MOSTRAR_MS,
  PeticionesEnCursoService,
  TIEMPO_MINIMO_A_LA_VISTA_MS,
} from './peticiones-en-curso.service';

/** Una petición que no responde hasta que el test la suelta. */
function peticionPendiente(): { soltar: () => Promise<void> } {
  let responder: (respuesta: Response) => void = () => undefined;
  vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(
    new Promise<Response>((resolver) => (responder = resolver)),
  );
  return {
    soltar: async () => {
      responder(new Response('[]'));
      await vi.advanceTimersByTimeAsync(0);
    },
  };
}

describe('PeticionesEnCursoService', () => {
  let servicio: PeticionesEnCursoService;

  beforeEach(() => {
    vi.useFakeTimers();
    servicio = TestBed.inject(PeticionesEnCursoService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('no se ve si la petición responde enseguida', async () => {
    const peticion = peticionPendiente();
    void servicio.fetch('/rest');
    await vi.advanceTimersByTimeAsync(ESPERA_ANTES_DE_MOSTRAR_MS - 50);
    await peticion.soltar();
    await vi.advanceTimersByTimeAsync(ESPERA_ANTES_DE_MOSTRAR_MS);
    expect(servicio.visible()).toBe(false);
  });

  it('se ve si la espera se alarga y se queda el tiempo mínimo', async () => {
    const peticion = peticionPendiente();
    void servicio.fetch('/rest');
    await vi.advanceTimersByTimeAsync(ESPERA_ANTES_DE_MOSTRAR_MS);
    expect(servicio.visible()).toBe(true);

    await peticion.soltar();
    expect(servicio.visible()).toBe(true);
    await vi.advanceTimersByTimeAsync(TIEMPO_MINIMO_A_LA_VISTA_MS);
    expect(servicio.visible()).toBe(false);
  });

  it('espera a que terminen todas las peticiones', async () => {
    const primera = peticionPendiente();
    const segunda = peticionPendiente();
    void servicio.fetch('/rest/a');
    void servicio.fetch('/rest/b');
    await vi.advanceTimersByTimeAsync(ESPERA_ANTES_DE_MOSTRAR_MS);

    await primera.soltar();
    await vi.advanceTimersByTimeAsync(TIEMPO_MINIMO_A_LA_VISTA_MS);
    expect(servicio.visible()).toBe(true);

    await segunda.soltar();
    await vi.advanceTimersByTimeAsync(TIEMPO_MINIMO_A_LA_VISTA_MS);
    expect(servicio.visible()).toBe(false);
  });

  it('una petición fallida también cuenta como terminada', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('sin red'));
    await expect(servicio.fetch('/rest')).rejects.toThrow('sin red');
    await vi.advanceTimersByTimeAsync(ESPERA_ANTES_DE_MOSTRAR_MS);
    expect(servicio.visible()).toBe(false);
  });
});
