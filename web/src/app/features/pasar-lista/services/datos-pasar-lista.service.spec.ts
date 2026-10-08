import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import { DisponibilidadService } from '@data-access/disponibilidad/disponibilidad.service';
import type { JugadorEncuesta } from '@data-access/disponibilidad/interfaces/jugador-encuesta.interface';
import { DatosPasarListaService } from './datos-pasar-lista.service';

const diego: JugadorEncuesta = {
  id: 'diego',
  nombreMostrar: 'Diego',
  sexo: 'masculino',
  respuesta: null,
  convocado: false,
};

/** Promesa que el test resuelve o rechaza cuando quiere. */
function pendiente(): {
  promesa: Promise<void>;
  resolver: () => void;
  rechazar: (e: Error) => void;
} {
  let resolver!: () => void;
  let rechazar!: (e: Error) => void;
  const promesa = new Promise<void>((res, rej) => {
    resolver = res;
    rechazar = rej;
  });
  return { promesa, resolver, rechazar };
}

async function crear(guardarRespuesta: () => Promise<void>) {
  const llamadas: unknown[][] = [];
  TestBed.configureTestingModule({
    providers: [
      DatosPasarListaService,
      {
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap({ idConfrontacion: 'j2' })) },
      },
      { provide: ConfrontacionesService, useValue: { obtenerConfrontacion: async () => null } },
      {
        provide: DisponibilidadService,
        useValue: {
          obtenerListaEncuesta: async () => [diego],
          guardarRespuesta: (...args: unknown[]) => {
            llamadas.push(args);
            return guardarRespuesta();
          },
        },
      },
    ],
  });
  const datos = TestBed.inject(DatosPasarListaService);
  await vi.waitFor(() => expect(datos.recuento().total).toBe(1));
  return { datos, llamadas };
}

describe('DatosPasarListaService', () => {
  it('refleja la respuesta al instante y la guarda', async () => {
    const guardado = pendiente();
    const { datos, llamadas } = await crear(() => guardado.promesa);

    const respuesta = datos.responder(diego, 'si');
    expect(datos.recuento().pueden).toBe(1);
    expect(datos.guardando().has('diego')).toBe(true);

    guardado.resolver();
    await respuesta;
    expect(llamadas).toEqual([['j2', 'diego', 'si']]);
    expect(datos.guardando().has('diego')).toBe(false);
  });

  it('deshace la respuesta y guarda el error si falla', async () => {
    const { datos } = await crear(() => Promise.reject(new Error('Sin conexión.')));

    await datos.responder(diego, 'no');

    expect(datos.recuento().noPueden).toBe(0);
    expect(datos.recuento().sinResponder).toBe(1);
    expect(datos.errores().get('diego')).toBe('Sin conexión.');
  });

  it('ignora un segundo toque mientras se guarda el primero', async () => {
    const guardado = pendiente();
    const { datos, llamadas } = await crear(() => guardado.promesa);

    const primera = datos.responder(diego, 'si');
    await datos.responder(diego, 'no');
    guardado.resolver();
    await primera;

    expect(llamadas).toHaveLength(1);
    expect(datos.recuento().pueden).toBe(1);
  });
});
