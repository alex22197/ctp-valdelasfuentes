import { leerColoresGraficas } from './opciones-comunes';
import { altoBalance, describirBalance, hayBalance, opcionesBalance } from './opciones-balance';

const COLORES = leerColoresGraficas({ getPropertyValue: (variable: string) => variable });

interface Serie {
  data: number[];
  label: { formatter: (parametros: { dataIndex: number }) => string };
}

const filas = [
  { nombre: 'En casa', ganados: 3, perdidos: 1 },
  { nombre: 'Fuera', ganados: 0, perdidos: 2 },
];

describe('opcionesBalance', () => {
  it('dibuja la proporción y escribe el número de cada parte, salvo el 0', () => {
    const [ganados, perdidos] = (opcionesBalance(filas, COLORES, true) as { series: Serie[] })
      .series;
    expect(ganados?.data).toEqual([75, 0]);
    expect(perdidos?.data).toEqual([25, 100]);
    expect(ganados?.label.formatter({ dataIndex: 0 })).toBe('3');
    expect(ganados?.label.formatter({ dataIndex: 1 })).toBe('');
  });

  it('describe las filas y sabe si hay algo que enseñar', () => {
    expect(describirBalance(filas)).toBe(
      'En casa: 3 ganados y 1 perdido. Fuera: 0 ganados y 2 perdidos.',
    );
    expect(hayBalance(filas)).toBe(true);
    expect(hayBalance([{ nombre: 'Nada', ganados: 0, perdidos: 0 }])).toBe(false);
    expect(altoBalance(filas)).toBe(150);
  });
});
