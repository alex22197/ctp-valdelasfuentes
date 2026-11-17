import type { JugadorGestion } from '@data-access/jugadores/interfaces/jugador-gestion.interface';
import { agruparGestionPlantilla } from './agrupar-gestion-plantilla';

const jugador = (
  nombreMostrar: string,
  sexo: JugadorGestion['sexo'],
  cambios: Partial<JugadorGestion> = {},
): JugadorGestion => ({
  id: nombreMostrar.toLowerCase(),
  nombreMostrar,
  nombreCompleto: null,
  sexo,
  ladoPreferido: null,
  comodin: false,
  inscritoOficial: true,
  baja: null,
  ...cambios,
});

describe('agruparGestionPlantilla', () => {
  it('reparte por sexo, comodines aparte y bajas al final, en orden alfabético', () => {
    const grupos = agruparGestionPlantilla([
      jugador('Sergio', 'masculino'),
      jugador('Álvaro', 'masculino'),
      jugador('Marta', 'femenino'),
      jugador('Jess', 'femenino', { comodin: true }),
      jugador('Olga', 'femenino', { comodin: true }),
      jugador('Walter', 'masculino', { baja: '2026-11-17' }),
    ]);
    const nombres = (lista: readonly JugadorGestion[]): string[] =>
      lista.map((j) => j.nombreMostrar);
    expect(nombres(grupos.chicos)).toEqual(['Álvaro', 'Sergio']);
    expect(nombres(grupos.chicas)).toEqual(['Marta']);
    expect(nombres(grupos.comodines)).toEqual(['Jess', 'Olga']);
    expect(nombres(grupos.bajas)).toEqual(['Walter']);
  });

  it('con nadie, todo vacío', () => {
    expect(agruparGestionPlantilla([])).toEqual({
      chicos: [],
      chicas: [],
      comodines: [],
      bajas: [],
    });
  });
});
