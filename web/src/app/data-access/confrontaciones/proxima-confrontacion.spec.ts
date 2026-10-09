import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';
import type { EstadoConfrontacion } from './interfaces/estado-confrontacion.type';
import { elegirProximaConfrontacion } from './proxima-confrontacion';

const equipo = { id: 'e', nombre: 'Equipo', esNuestro: false };

function jornada(numero: number, estado: EstadoConfrontacion): ConfrontacionNuestroEquipo {
  return {
    id: `j${numero}`,
    jornada: numero,
    local: equipo,
    visitante: equipo,
    rival: equipo,
    condicion: 'local',
    estado,
    fechaPrevista: null,
    fechaHora: null,
    sede: null,
    numeroPistas: null,
    marcador: null,
  };
}

describe('elegirProximaConfrontacion', () => {
  it('salta las jornadas ya jugadas', () => {
    const calendario = [jornada(1, 'jugada'), jornada(2, 'programada'), jornada(3, 'programada')];
    expect(elegirProximaConfrontacion(calendario)?.jornada).toBe(2);
  });

  it('tiene en cuenta las jornadas aplazadas', () => {
    const calendario = [jornada(1, 'aplazada'), jornada(2, 'programada')];
    expect(elegirProximaConfrontacion(calendario)?.jornada).toBe(1);
  });

  it('devuelve null cuando ya se ha jugado todo', () => {
    expect(elegirProximaConfrontacion([jornada(1, 'jugada')])).toBeNull();
  });
});
