import { opcionesEstadoJornada } from './opciones-estado-jornada';

const destinos = (estado: Parameters<typeof opcionesEstadoJornada>[0]): string[] =>
  opcionesEstadoJornada(estado).map((opcion) => opcion.destino);

describe('opcionesEstadoJornada', () => {
  it('una programada se aplaza o se suspende', () => {
    expect(destinos('programada')).toEqual(['aplazada', 'suspendida']);
  });

  it('una aplazada vuelve a programada o pasa a suspendida', () => {
    expect(destinos('aplazada')).toEqual(['programada', 'suspendida']);
  });

  it('una suspendida vuelve a programada o pasa a aplazada', () => {
    expect(destinos('suspendida')).toEqual(['programada', 'aplazada']);
  });

  it('solo se confirma lo que borra la fecha', () => {
    for (const estado of ['programada', 'aplazada', 'suspendida'] as const) {
      for (const opcion of opcionesEstadoJornada(estado)) {
        expect(opcion.confirmacion !== null).toBe(opcion.destino !== 'programada');
      }
    }
  });

  it('nunca ofrece quedarse como está', () => {
    for (const estado of ['programada', 'aplazada', 'suspendida'] as const) {
      expect(destinos(estado)).not.toContain(estado);
    }
  });
});
