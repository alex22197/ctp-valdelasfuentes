import { ACCION_INACTIVA, AccionConEstado } from './accion-con-estado';

/** Una promesa que se resuelve o rechaza cuando el test lo decide. */
function pendiente(): {
  promesa: Promise<void>;
  resolver: () => void;
  rechazar: (e: unknown) => void;
} {
  let resolver: () => void = () => undefined;
  let rechazar: (e: unknown) => void = () => undefined;
  const promesa = new Promise<void>((res, rej) => {
    resolver = res;
    rechazar = rej;
  });
  return { promesa, resolver, rechazar };
}

describe('AccionConEstado', () => {
  it('empieza inactiva y pasa por «en curso» hasta «hecha»', async () => {
    const accion = new AccionConEstado();
    const tarea = pendiente();
    expect(accion.estado()).toEqual(ACCION_INACTIVA);

    const resultado = accion.ejecutar(() => tarea.promesa);
    expect(accion.estado()).toEqual({ tipo: 'en-curso' });
    expect(accion.enCurso()).toBe(true);

    tarea.resolver();
    expect(await resultado).toBe(true);
    expect(accion.estado()).toEqual({ tipo: 'hecho' });
    expect(accion.error()).toBeNull();
  });

  it('con un fallo guarda el mensaje, o el de por defecto si no lo hay', async () => {
    const accion = new AccionConEstado('No se ha podido guardar.');
    expect(await accion.ejecutar(() => Promise.reject(new Error('Sin permisos')))).toBe(false);
    expect(accion.estado()).toEqual({ tipo: 'error', mensaje: 'Sin permisos' });
    expect(accion.error()).toBe('Sin permisos');

    await accion.ejecutar(() => Promise.reject('algo raro'));
    expect(accion.error()).toBe('No se ha podido guardar.');
  });

  it('no lanza una segunda acción mientras hay una en curso', async () => {
    const accion = new AccionConEstado();
    const tarea = pendiente();
    let segundaLanzada = false;

    const primera = accion.ejecutar(() => tarea.promesa);
    const segunda = await accion.ejecutar(async () => {
      segundaLanzada = true;
    });
    expect(segunda).toBe(false);
    expect(segundaLanzada).toBe(false);

    tarea.resolver();
    await primera;
    expect(accion.estado()).toEqual({ tipo: 'hecho' });
  });

  it('se puede volver a inactiva', async () => {
    const accion = new AccionConEstado();
    await accion.ejecutar(() => Promise.resolve());
    accion.reiniciar();
    expect(accion.estado()).toEqual(ACCION_INACTIVA);
  });
});
