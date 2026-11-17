import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { analizarPaginaEliminatoria } from './pagina-eliminatoria.ts';

describe('analizarPaginaEliminatoria', () => {
  it('lee todos los retos de la zona 1 de 2026-27', () => {
    const html = readFileSync(new URL('./fixtures/retos-zona-1.html', import.meta.url), 'utf8');
    const cruces = analizarPaginaEliminatoria(html);
    expect(cruces.length).toBeGreaterThan(10);
    expect(cruces).toContainEqual({
      local: 'CTPA Valdelasfuentes',
      visitante: 'SAN SEBASTIÁN DE LOS REYES ¨B¨',
      partidosLocal: 4,
      partidosVisitante: 2,
    });
    expect(cruces).toContainEqual({
      local: 'PADELGON “C”',
      visitante: "Pa'delante",
      partidosLocal: 2,
      partidosVisitante: 4,
    });
  });

  it('falla si no hay cruces', () => {
    expect(() => analizarPaginaEliminatoria('<html></html>')).toThrow(/ningún cruce/);
  });
});
