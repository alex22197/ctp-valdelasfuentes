import type { ResumenJugador } from '@data-access/estadisticas/interfaces/resumen-jugador.interface';
import { leerColoresGraficas } from '@shared/utils/graficas/opciones-comunes';
import type { FilaTemporada } from '../interfaces/fila-temporada.interface';
import {
  describirJornada,
  opcionesAnillo,
  opcionesSetsJuegos,
  opcionesTemporada,
} from './opciones-ficha';

// Cada color vale el nombre de su variable, para comprobar cuál se usa.
const COLORES = leerColoresGraficas({ getPropertyValue: (variable: string) => variable });

const parte = <T>(opciones: object, clave: string): T =>
  (opciones as Record<string, T>)[clave] as T;

interface Dato {
  value: number | number[] | null;
  label?: { formatter?: string; position?: string };
  itemStyle?: { color: string };
}
interface Serie {
  data: Dato[];
}
interface SerieEtiquetada {
  data: number[];
  label: { formatter: (p: { dataIndex: number }) => string };
}

const resumen: ResumenJugador = {
  partidos: 3,
  ganados: 2,
  perdidos: 1,
  porcentajeVictorias: 67,
  setsGanados: 4,
  setsPerdidos: 2,
  juegosGanados: 30,
  juegosPerdidos: 10,
  jornadas: 3,
  woAFavor: 0,
};

const fila = (cambios: Partial<FilaTemporada>): FilaTemporada => ({
  confrontacionId: 'j1',
  jornada: 1,
  rival: 'Soto Torrejón',
  condicion: 'visitante',
  resultado: 'ganado',
  detalle: 'Masculino 2 con Pablo, de revés',
  marcador: '3-6 7-5 6-3',
  diferenciaJuegos: 2,
  esWo: false,
  ...cambios,
});

describe('opcionesAnillo', () => {
  it('reparte ganados y perdidos y pone el porcentaje en el centro', () => {
    const [serie] = parte<Serie[]>(opcionesAnillo(resumen, COLORES, true), 'series');
    expect(serie?.data.map((d) => d.value)).toEqual([2, 1]);
    expect(serie?.data[0]?.label?.formatter).toBe('67 %');
    expect(serie?.data[1]?.itemStyle?.color).toBe('--color-derrota');
  });
});

describe('opcionesSetsJuegos', () => {
  it('dibuja la proporción y conserva el número de cada parte', () => {
    const [ganados] = parte<SerieEtiquetada[]>(
      opcionesSetsJuegos(resumen, COLORES, true),
      'series',
    );
    expect(ganados?.data).toEqual([(100 * 4) / 6, 75]);
    expect(ganados?.label.formatter({ dataIndex: 1 })).toBe('30');
  });
});

describe('opcionesTemporada', () => {
  it('deja vacía la jornada que no jugó y escribe WO en vez de una barra', () => {
    const opciones = opcionesTemporada(
      [
        {
          nombre: 'Apertura',
          filas: [
            fila({ diferenciaJuegos: -5, resultado: 'perdido' }),
            fila({
              confrontacionId: 'j2',
              jornada: 2,
              resultado: 'no-jugo',
              diferenciaJuegos: null,
            }),
            fila({ confrontacionId: 'j3', jornada: 3, esWo: true, diferenciaJuegos: null }),
          ],
        },
      ],
      COLORES,
      false,
    );
    const datos = parte<Serie[]>(opciones, 'series')[0]?.data ?? [];
    expect(datos.map((d) => d.value)).toEqual([-5, null, 0]);
    expect(datos[0]?.label?.position).toBe('bottom');
    expect(datos[0]?.itemStyle?.color).toBe('--color-derrota');
    expect(datos[2]?.label?.formatter).toBe('WO');
  });

  it('describe cada jornada para la ayuda al tocar', () => {
    expect(describirJornada(fila({}))).toBe('J1 contra Soto Torrejón: ganado, 3-6 7-5 6-3');
    expect(describirJornada(fila({ resultado: 'no-jugo' }))).toBe(
      'J1 contra Soto Torrejón: no jugó',
    );
    expect(describirJornada(undefined)).toBe('');
  });
});
