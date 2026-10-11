import { contarPartidos, leerColoresGraficas, opcionesComunes } from './opciones-comunes';

describe('leerColoresGraficas', () => {
  it('lee cada token y quita los espacios', () => {
    const colores = leerColoresGraficas({
      getPropertyValue: (variable: string) => ` valor${variable} `,
    });
    expect(colores.pista).toBe('valor--color-pista');
    expect(colores.fuente).toBe('valor--fuente');
  });
});

describe('opcionesComunes', () => {
  it('desactiva la animación si se pide y abre la ayuda al tocar', () => {
    const colores = leerColoresGraficas({ getPropertyValue: () => 'x' });
    expect(opcionesComunes(colores, false)).toMatchObject({
      animation: false,
      aria: { enabled: true },
      tooltip: { triggerOn: 'click' },
    });
  });
});

describe('contarPartidos', () => {
  it('usa singular y plural', () => {
    expect(contarPartidos(1)).toBe('1 partido');
    expect(contarPartidos(3)).toBe('3 partidos');
  });
});
