import { type FilaConfrontacion, mapearConfrontacionNuestroEquipo } from './confrontacion.mapper';

const nosotros = { id: 'ctpa', nombre: 'CTPA Valdelasfuentes', es_nuestro: true };
const soto = { id: 'soto', nombre: 'Soto Torrejón', es_nuestro: false };
const padelgon = { id: 'padelgon', nombre: 'Padelgon "C"', es_nuestro: false };

function fila(cambios: Partial<FilaConfrontacion> = {}): FilaConfrontacion {
  return {
    id: 'j1',
    jornada: 1,
    estado: 'programada',
    fecha_prevista: '2026-10-10',
    fecha_hora: null,
    sede: null,
    num_pistas: 6,
    partidos_local: null,
    partidos_visitante: null,
    local: soto,
    visitante: nosotros,
    ...cambios,
  };
}

describe('mapearConfrontacionNuestroEquipo', () => {
  it('identifica al rival y que jugamos fuera', () => {
    const resultado = mapearConfrontacionNuestroEquipo(fila());
    expect(resultado?.rival.nombre).toBe('Soto Torrejón');
    expect(resultado?.condicion).toBe('visitante');
  });

  it('da el marcador desde nuestro lado aunque seamos visitantes', () => {
    const resultado = mapearConfrontacionNuestroEquipo(
      fila({ partidos_local: 2, partidos_visitante: 4 }),
    );
    expect(resultado?.marcador).toEqual({ nuestros: 4, rival: 2 });
  });

  it('no tiene marcador mientras falte algún resultado', () => {
    expect(mapearConfrontacionNuestroEquipo(fila({ partidos_local: 3 }))?.marcador).toBeNull();
  });

  it('usa el marcador calculado de nuestros partidos cuando todos tienen ganador', () => {
    const resultado = mapearConfrontacionNuestroEquipo(
      fila({ partidos_local: 3, partidos_visitante: 3 }),
      { partidos_ganados: 4, partidos_perdidos: 2, partidos_pendientes: 0 },
    );
    expect(resultado?.marcador).toEqual({ nuestros: 4, rival: 2 });
  });

  it('usa el de la liga mientras falte algún partido por meter', () => {
    const resultado = mapearConfrontacionNuestroEquipo(
      fila({ partidos_local: 2, partidos_visitante: 4 }),
      { partidos_ganados: 3, partidos_perdidos: 1, partidos_pendientes: 2 },
    );
    expect(resultado?.marcador).toEqual({ nuestros: 4, rival: 2 });
  });

  it('descarta las confrontaciones en las que no jugamos', () => {
    expect(mapearConfrontacionNuestroEquipo(fila({ visitante: padelgon }))).toBeNull();
  });
});
