import type { LadosJugador } from '@data-access/estadisticas/interfaces/lados-jugador.interface';
import { leerColoresGraficas } from '@shared/utils/graficas/opciones-comunes';
import { OPACIDAD_ATENUADA } from './opciones-matriz';
import { datosLados, describirLados, opcionesLados, ordenarLados } from './reves-drive';

const balance = (partidos: number, porcentajeVictorias: number | null) => ({
  partidos,
  ganados: 0,
  perdidos: 0,
  porcentajeVictorias,
});

const sergio: LadosJugador = {
  id: 's',
  nombreMostrar: 'Sergio',
  comodin: false,
  reves: balance(3, 67),
  drive: balance(1, 0),
};
const alex: LadosJugador = {
  id: 'a',
  nombreMostrar: 'Alex',
  comodin: false,
  reves: balance(1, 100),
  drive: balance(0, null),
};

interface Serie {
  label: { formatter: (p: { value: number }) => string };
  data: { value: number; itemStyle: { opacity: number } }[];
}

describe('revés contra drive', () => {
  it('ordena por partidos y describe cada lado', () => {
    expect(ordenarLados([alex, sergio]).map((l) => l.nombreMostrar)).toEqual(['Sergio', 'Alex']);
    expect(describirLados(sergio)).toBe(
      'Sergio: de revés, 3 partidos (67 %); de drive, 1 partido (0 %)',
    );
    expect(describirLados(alex)).toBe('Alex: de revés, 1 partido (100 %); de drive, ninguno');
  });

  it('dibuja el revés en negativo pero lo escribe en positivo', () => {
    const colores = leerColoresGraficas({ getPropertyValue: (variable: string) => variable });
    const [reves] = (opcionesLados([sergio], colores, true) as { series: Serie[] }).series;
    expect(reves?.data[0]?.value).toBe(-3);
    expect(reves?.label.formatter({ value: -3 })).toBe('3');
    expect(reves?.label.formatter({ value: 0 })).toBe('');
  });

  it('atenúa a todos menos al resaltado', () => {
    const { drive } = datosLados([sergio, alex], 'a') as {
      drive: { itemStyle: { opacity: number } }[];
    };
    expect(drive.map((d) => d.itemStyle.opacity)).toEqual([OPACIDAD_ATENUADA, 1]);
  });
});
