import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { analizarPaginaGrupo } from './pagina-grupo.ts';

const pagina = (nombre: string): string =>
  readFileSync(new URL(`./fixtures/${nombre}.html`, import.meta.url), 'utf8');

describe('analizarPaginaGrupo', () => {
  it('lee la apertura de 2026-27 tal como la publicó la liga', () => {
    const resultado = analizarPaginaGrupo(pagina('apertura-4'));
    expect(resultado.fase).toBe('Apertura');
    expect(resultado.jornadas.map((j) => j.numero)).toEqual([1, 2, 3]);
    expect(resultado.jornadas[0]?.confrontaciones).toEqual([
      {
        local: 'PADELGON “C”',
        visitante: 'PADEL ATTRACTION B',
        partidosLocal: 1,
        partidosVisitante: 5,
      },
      {
        local: 'SOTO TORREJON',
        visitante: 'CTPA Valdelasfuentes',
        partidosLocal: 5,
        partidosVisitante: 1,
      },
    ]);
    expect(resultado.clasificacion).toHaveLength(4);
    expect(resultado.clasificacion[3]).toEqual({
      posicion: 4,
      equipo: 'CTPA Valdelasfuentes',
      puntos: 1,
      ganados: 0,
      empatados: 1,
      perdidos: 2,
      partidosFavor: 6,
      partidosContra: 12,
    });
  });

  it('lee el clausura recién empezado, con jornadas sin jugar a 0-0 y nombres con espacios', () => {
    const resultado = analizarPaginaGrupo(pagina('clausura-4'));
    expect(resultado.fase).toBe('Clausura');
    expect(resultado.jornadas[0]?.confrontaciones).toEqual([
      {
        local: 'CTPA Valdelasfuentes',
        visitante: "Pa'delante",
        partidosLocal: 0,
        partidosVisitante: 0,
      },
      {
        local: 'PADEL ATTRACTION B',
        visitante: 'Bamvolea Punta Chica A',
        partidosLocal: 5,
        partidosVisitante: 1,
      },
    ]);
    expect(resultado.clasificacion.map((f) => f.equipo)).toContain('Bamvolea Punta Chica A');
  });

  it('decodifica entidades HTML en los nombres', () => {
    const html = pagina('apertura-4').replace(
      'PADEL ATTRACTION B',
      'PADEL &amp; CO &#8220;B&#8221;',
    );
    const resultado = analizarPaginaGrupo(html);
    expect(resultado.jornadas[0]?.confrontaciones[0]?.visitante).toBe('PADEL & CO “B”');
  });

  it('falla con un mensaje claro si la página cambia de forma', () => {
    expect(() => analizarPaginaGrupo('<html></html>')).toThrow(/clasificación/);
    const sinJornadas = pagina('apertura-4').replace(/Jornada \d+/g, 'Semana');
    expect(() => analizarPaginaGrupo(sinJornadas)).toThrow(/ninguna jornada/);
    const otrasColumnas = pagina('apertura-4').replace('>Puntos<', '>Pts<');
    expect(() => analizarPaginaGrupo(otrasColumnas)).toThrow(/otras columnas/);
    const marcadorRaro = pagina('apertura-4').replace(
      '<b>1</b></td></tr></table>',
      '<b>?</b></td></tr></table>',
    );
    expect(() => analizarPaginaGrupo(marcadorRaro)).toThrow(/no es un número/);
  });
});
