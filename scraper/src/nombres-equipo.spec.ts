import { describe, expect, it } from 'vitest';
import { limpiarNombreEquipo, normalizarNombreEquipo } from './nombres-equipo.ts';

describe('normalizarNombreEquipo', () => {
  it('iguala mayúsculas, acentos y comillas', () => {
    expect(normalizarNombreEquipo('PADELGON “C”')).toBe(normalizarNombreEquipo('Padelgon "C"'));
    expect(normalizarNombreEquipo('SOTO TORREJON')).toBe(normalizarNombreEquipo('Soto Torrejón'));
    expect(normalizarNombreEquipo('SAN SEBASTIÁN DE LOS REYES ¨B¨')).toBe(
      normalizarNombreEquipo('San Sebastián de los Reyes "B"'),
    );
  });

  it('ignora los espacios de más', () => {
    expect(normalizarNombreEquipo("Pa'delante ")).toBe("PA'DELANTE");
    expect(normalizarNombreEquipo('Bamvolea  Punta\tChica A')).toBe('BAMVOLEA PUNTA CHICA A');
  });

  it('distingue equipos distintos', () => {
    expect(normalizarNombreEquipo('Padel Attraction A')).not.toBe(
      normalizarNombreEquipo('Padel Attraction B'),
    );
  });
});

describe('limpiarNombreEquipo', () => {
  it('conserva el texto de la liga, sin espacios sobrantes', () => {
    expect(limpiarNombreEquipo(" Pa'delante ")).toBe("Pa'delante");
    expect(limpiarNombreEquipo('PADELGON “C”')).toBe('PADELGON “C”');
  });
});
