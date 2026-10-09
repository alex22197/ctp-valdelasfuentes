import type { PartidoConResultado } from './interfaces/partido-con-resultado.interface';
import { completarPartidosSegunFormato } from './partidos-segun-formato';

const formato = { masculino: 3, femenino: 2, mixto: 1 };

describe('completarPartidosSegunFormato', () => {
  it('devuelve los 6 partidos en el orden de la normativa aunque no exista ninguno', () => {
    const partidos = completarPartidosSegunFormato(formato, []);
    expect(partidos.map((p) => `${p.tipo} ${p.numero}`)).toEqual([
      'masculino 1',
      'masculino 2',
      'masculino 3',
      'femenino 1',
      'femenino 2',
      'mixto 1',
    ]);
    expect(partidos.every((p) => p.marcador.resultado === null && p.reves === null)).toBe(true);
  });

  it('conserva los partidos que ya existen', () => {
    const mixto: PartidoConResultado = {
      tipo: 'mixto',
      numero: 1,
      reves: { id: 'rocio', nombreMostrar: 'Rocio' },
      drive: null,
      marcador: { resultado: 'wo_favor', ganado: null, sets: [] },
    };
    expect(completarPartidosSegunFormato(formato, [mixto]).at(-1)).toBe(mixto);
  });

  it('ignora partidos que no caben en el formato', () => {
    const sobrante: PartidoConResultado = {
      tipo: 'femenino',
      numero: 3,
      reves: null,
      drive: null,
      marcador: { resultado: null, ganado: null, sets: [] },
    };
    expect(completarPartidosSegunFormato(formato, [sobrante])).toHaveLength(6);
  });
});
