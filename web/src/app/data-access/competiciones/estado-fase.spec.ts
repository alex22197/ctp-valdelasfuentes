import { estadoFase, etiquetaSinJornada } from './estado-fase';
import type { Fase } from './interfaces/fase.interface';

const fase = (orden: number): Fase => ({
  id: `f${orden}`,
  tipo: 'apertura',
  nombre: `Fase ${orden}`,
  orden,
  urlGrupo: null,
  inicio: null,
  fin: null,
});

describe('estadoFase', () => {
  it('compara el orden con el de la fase actual', () => {
    expect(estadoFase(fase(1), fase(2))).toBe('terminada');
    expect(estadoFase(fase(2), fase(2))).toBe('en-juego');
    expect(estadoFase(fase(3), fase(2))).toBe('proxima');
  });

  it('sin fase actual, todas en juego', () => {
    expect(estadoFase(fase(1), null)).toBe('en-juego');
  });
});

describe('etiquetaSinJornada', () => {
  it('las eliminatorias llevan su nombre corto; las ligas, nada', () => {
    expect(etiquetaSinJornada('retos')).toBe('Reto');
    expect(etiquetaSinJornada('playoff')).toBe('Play-off');
    expect(etiquetaSinJornada('apertura')).toBeNull();
  });
});
