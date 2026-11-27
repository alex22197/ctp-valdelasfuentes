import { estaPorJugar, etiquetaEstadoJornada } from './estado-jornada';

describe('estaPorJugar', () => {
  it('programada, aplazada y suspendida siguen por jugar', () => {
    expect(estaPorJugar('programada')).toBe(true);
    expect(estaPorJugar('aplazada')).toBe(true);
    expect(estaPorJugar('suspendida')).toBe(true);
  });

  it('jugada y no comparecencia están terminadas', () => {
    expect(estaPorJugar('jugada')).toBe(false);
    expect(estaPorJugar('no_comparecencia')).toBe(false);
  });
});

describe('etiquetaEstadoJornada', () => {
  it('nombra los estados fuera de lo normal', () => {
    expect(etiquetaEstadoJornada('aplazada')).toBe('Aplazada');
    expect(etiquetaEstadoJornada('suspendida')).toBe('Suspendida');
    expect(etiquetaEstadoJornada('no_comparecencia')).toBe('No comparecencia');
  });

  it('no dice nada de una programada ni de una jugada', () => {
    expect(etiquetaEstadoJornada('programada')).toBeNull();
    expect(etiquetaEstadoJornada('jugada')).toBeNull();
  });
});
