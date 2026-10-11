import type { BalancePuestoEquipo } from '@data-access/estadisticas/interfaces/balance-puesto-equipo.interface';
import type { ParticipacionJugador } from '@data-access/estadisticas/interfaces/participacion-jugador.interface';
import type { MatrizParejas } from '../interfaces/matriz-parejas.interface';
import { leerColoresGraficas } from './opciones-comunes';
import { describirCelda, nombreEnEje, opcionesMatriz } from './opciones-matriz';
import { opcionesParticipacion } from './opciones-participacion';
import { describirPuesto, opcionesPuestos } from './opciones-puestos';

// Cada color vale el nombre de su variable, para comprobar cuál se usa.
const COLORES = leerColoresGraficas({ getPropertyValue: (variable: string) => variable });

/** Acceso cómodo a las partes de unas opciones de ECharts en los tests. */
const parte = <T>(opciones: object, clave: string): T =>
  (opciones as Record<string, T>)[clave] as T;

interface Eje {
  data: string[];
}
interface Dato {
  value: number | number[];
  itemStyle?: { color: string };
  label?: { color: string };
}
interface Serie {
  name?: string;
  stack?: string;
  data: (Dato | number)[];
}

const puesto = (cambios: Partial<BalancePuestoEquipo>): BalancePuestoEquipo => ({
  tipo: 'masculino',
  numero: 1,
  partidos: 3,
  ganados: 2,
  perdidos: 1,
  porcentajeVictorias: 67,
  woAFavor: 0,
  woEnContra: 0,
  ...cambios,
});

describe('opcionesPuestos', () => {
  it('pone un puesto por barra, con el mixto en lima', () => {
    const opciones = opcionesPuestos(
      [puesto({}), puesto({ tipo: 'mixto', porcentajeVictorias: null })],
      COLORES,
      true,
    );
    expect(parte<Eje>(opciones, 'xAxis').data).toEqual(['M1', 'Mixto']);
    const datos = parte<Serie[]>(opciones, 'series')[0]?.data as Dato[];
    expect(datos.map((d) => d.value)).toEqual([67, 0]);
    expect(datos[1]?.itemStyle?.color).toBe('--color-mixto');
  });

  it('describe el puesto con sus WO', () => {
    expect(describirPuesto(puesto({ woEnContra: 1 }))).toBe(
      'Masculino 1: 2 de 3 partidos ganados (1 WO en contra)',
    );
    expect(describirPuesto(undefined)).toBe('');
  });
});

describe('opcionesMatriz', () => {
  const matriz: MatrizParejas = {
    filas: [{ id: 'a', nombreMostrar: 'Alex', comodin: false }],
    columnas: [{ id: 'r', nombreMostrar: 'Rocio', comodin: true }],
    celdas: [{ fila: 0, columna: 0, partidos: 2, porcentajeVictorias: 50 }],
  };

  it('marca a los comodines y escribe en blanco sobre las casillas oscuras', () => {
    const opciones = opcionesMatriz(matriz, COLORES, false);
    expect(parte<Eje>(opciones, 'xAxis').data).toEqual(['Rocio*']);
    expect(parte<Serie[]>(opciones, 'series')[0]?.data[0]).toEqual({
      value: [0, 0, 50, 2],
      label: { color: '--color-sobre-pista' },
    });
    expect(parte<boolean>(opciones, 'animation')).toBe(false);
  });

  it('describe cada casilla', () => {
    expect(describirCelda(matriz, 0)).toBe('Alex y Rocio: 2 partidos, 50 % ganados');
    expect(describirCelda(matriz, 5)).toBe('');
    expect(nombreEnEje(matriz.filas[0]!)).toBe('Alex');
  });
});

describe('opcionesParticipacion', () => {
  it('apila las cuatro categorías de cada jugador', () => {
    const diego: ParticipacionJugador = {
      id: 'd',
      nombreMostrar: 'Diego',
      confrontaciones: 3,
      jugadas: 1,
      disponibleSinJugar: 0,
      noDisponible: 1,
      sinResponder: 1,
      porcentajeJugadas: 33,
    };
    const series = parte<Serie[]>(opcionesParticipacion([diego], COLORES, true), 'series');
    expect(series.map((s) => [s.name, s.data[0], s.stack])).toEqual([
      ['Jugó', 1, 'jornadas'],
      ['Podía, sin convocar', 0, 'jornadas'],
      ['No podía', 1, 'jornadas'],
      ['Sin responder', 1, 'jornadas'],
    ]);
  });
});
