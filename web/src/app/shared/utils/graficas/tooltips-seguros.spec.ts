import { conTooltipsSeguros, escaparHtml } from './tooltips-seguros';

type Formateador = (...argumentos: unknown[]) => string;

function formatterDe(opciones: Record<string, unknown>): Formateador {
  return (opciones['tooltip'] as { formatter: Formateador }).formatter;
}

describe('escaparHtml', () => {
  it('deja inofensivas las etiquetas y los atributos', () => {
    expect(escaparHtml('<img src=x onerror="alert(1)">')).toBe(
      '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;',
    );
  });

  it('un nombre normal no cambia', () => {
    expect(escaparHtml('Álvaro y Joel: 2 de 3 ganados')).toBe('Álvaro y Joel: 2 de 3 ganados');
  });
});

describe('conTooltipsSeguros', () => {
  it('escapa lo que devuelve un formatter', () => {
    const opciones = conTooltipsSeguros({
      tooltip: { trigger: 'item', formatter: (): string => '<b>Equipo</b>' },
    }) as Record<string, unknown>;
    expect(formatterDe(opciones)()).toBe('&lt;b&gt;Equipo&lt;/b&gt;');
    expect((opciones['tooltip'] as { trigger: string }).trigger).toBe('item');
  });

  it('pasa los argumentos al formatter original', () => {
    const opciones = conTooltipsSeguros({
      tooltip: { formatter: ({ name }: { name: string }): string => `${name}: 3` },
    }) as Record<string, unknown>;
    expect(formatterDe(opciones)({ name: 'Pablo' })).toBe('Pablo: 3');
  });

  it('respeta las plantillas de texto, las listas y la falta de ayuda', () => {
    expect(conTooltipsSeguros({ tooltip: { formatter: '{c} %' } })).toEqual({
      tooltip: { formatter: '{c} %' },
    });
    const lista = conTooltipsSeguros({
      tooltip: [{ formatter: (): string => '<i>' }],
    }) as Record<string, unknown>;
    expect((lista['tooltip'] as { formatter: Formateador }[])[0].formatter()).toBe('&lt;i&gt;');
    const sinAyuda = { series: [] };
    expect(conTooltipsSeguros(sinAyuda)).toBe(sinAyuda);
  });
});
