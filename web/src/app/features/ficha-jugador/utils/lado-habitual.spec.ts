import type { BalanceLado } from '@data-access/estadisticas/interfaces/balance-lado.interface';
import { ladoHabitual } from './lado-habitual';

const lado = (l: BalanceLado['lado'], partidos: number): BalanceLado => ({
  lado: l,
  partidos,
  ganados: 0,
  perdidos: partidos,
  porcentajeVictorias: partidos ? 0 : null,
});

describe('ladoHabitual', () => {
  it('manda el lado preferido de la plantilla', () => {
    expect(ladoHabitual('drive', [lado('reves', 5)])).toBe('drive');
  });

  it('si no hay preferido, el lado con más partidos', () => {
    expect(ladoHabitual(null, [lado('drive', 1), lado('reves', 3)])).toBe('reves');
  });

  it('no decide si hay empate o no ha jugado', () => {
    expect(ladoHabitual(null, [lado('drive', 2), lado('reves', 2)])).toBeNull();
    expect(ladoHabitual(null, [])).toBeNull();
  });
});
