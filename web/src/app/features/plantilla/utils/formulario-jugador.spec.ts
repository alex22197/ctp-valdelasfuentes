import type { JugadorGestion } from '@data-access/jugadores/interfaces/jugador-gestion.interface';
import type { FormularioJugador } from '../interfaces/formulario-jugador.interface';
import { formularioDesdeJugador, leerFormularioJugador } from './formulario-jugador';

const olga: JugadorGestion = {
  id: 'olga',
  nombreMostrar: 'Olga',
  nombreCompleto: 'Olga Martín',
  sexo: 'femenino',
  ladoPreferido: 'reves',
  comodin: true,
  inscritoOficial: null,
  baja: null,
};

const vacio: FormularioJugador = {
  nombreMostrar: '',
  nombreCompleto: '',
  sexo: null,
  ladoPreferido: null,
  comodin: false,
  inscrito: 'sin-comprobar',
};

describe('formularioDesdeJugador', () => {
  it('rellena el formulario con el jugador, y vacío para uno nuevo', () => {
    expect(formularioDesdeJugador(olga)).toEqual({
      nombreMostrar: 'Olga',
      nombreCompleto: 'Olga Martín',
      sexo: 'femenino',
      ladoPreferido: 'reves',
      comodin: true,
      inscrito: 'sin-comprobar',
    });
    expect(formularioDesdeJugador({ ...olga, inscritoOficial: false }).inscrito).toBe('no');
    expect(formularioDesdeJugador(null)).toEqual(vacio);
  });
});

describe('leerFormularioJugador', () => {
  it('limpia los nombres y traduce la inscripción', () => {
    expect(
      leerFormularioJugador(
        {
          ...vacio,
          nombreMostrar: '  Marta   P ',
          nombreCompleto: ' ',
          sexo: 'femenino',
          inscrito: 'si',
        },
        null,
      ),
    ).toEqual({
      datos: {
        id: null,
        nombreMostrar: 'Marta P',
        nombreCompleto: null,
        sexo: 'femenino',
        ladoPreferido: null,
        comodin: false,
        inscritoOficial: true,
      },
    });
  });

  it('pide el nombre y el sexo, y limita los largos', () => {
    expect(leerFormularioJugador(vacio, null)).toHaveProperty('error');
    expect(leerFormularioJugador({ ...vacio, nombreMostrar: 'Ana' }, null)).toEqual({
      error: 'Marca si es chico o chica: decide en qué partidos puede jugar.',
    });
    const largo = leerFormularioJugador(
      { ...vacio, nombreMostrar: 'a'.repeat(31), sexo: 'masculino' },
      null,
    );
    expect(largo).toHaveProperty('error');
    expect(
      leerFormularioJugador({ ...vacio, nombreMostrar: 'Ana', sexo: 'femenino' }, 'ana'),
    ).toMatchObject({ datos: { id: 'ana' } });
  });
});
