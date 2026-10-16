import { type FilaGestor, mapearGestor } from './gestor.mapper';

const fila: FilaGestor = {
  email: 'capitan@example.com',
  nombre: 'Capi Prueba',
  rol: 'capitan',
  pendiente: false,
  es_tu: false,
};

describe('mapearGestor', () => {
  it('pasa cada columna a su campo', () => {
    expect(mapearGestor(fila)).toEqual({
      email: 'capitan@example.com',
      nombre: 'Capi Prueba',
      rol: 'capitan',
      pendiente: false,
      esTu: false,
    });
  });

  it('una invitación aún no tiene nombre', () => {
    const invitacion = { ...fila, nombre: null as unknown as string, pendiente: true };
    expect(mapearGestor(invitacion)).toMatchObject({ nombre: null, pendiente: true });
  });
});
