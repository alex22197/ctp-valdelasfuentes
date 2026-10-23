import { mapearCuentaPendiente } from './cuenta-pendiente.mapper';

describe('mapearCuentaPendiente', () => {
  const fila = {
    email: 'nueva@example.com',
    nombre: '  Nueva Persona ',
    alta: '2026-10-21T18:00:00Z',
    ultimo_acceso: '2026-10-22T09:00:00Z',
  };

  it('limpia el nombre y conserva el correo y el alta', () => {
    expect(mapearCuentaPendiente(fila)).toEqual({
      email: 'nueva@example.com',
      nombre: 'Nueva Persona',
      alta: '2026-10-21T18:00:00Z',
    });
  });

  it('sin nombre en Google, null', () => {
    expect(mapearCuentaPendiente({ ...fila, nombre: '' }).nombre).toBeNull();
  });
});
