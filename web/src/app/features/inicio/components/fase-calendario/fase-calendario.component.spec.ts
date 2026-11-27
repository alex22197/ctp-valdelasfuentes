import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { EstadoFase } from '@data-access/competiciones/interfaces/estado-fase.type';
import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import { FaseCalendarioComponent } from './fase-calendario.component';

const equipo = { id: 'r', nombre: 'Rival', esNuestro: false };
const fase = { id: 'f1', tipo: 'apertura', nombre: 'Apertura', orden: 1 } as Fase;

function jornada(
  numero: number,
  cambios: Partial<ConfrontacionNuestroEquipo> = {},
): ConfrontacionNuestroEquipo {
  return {
    id: `j${numero}`,
    jornada: numero,
    local: equipo,
    visitante: equipo,
    rival: equipo,
    condicion: 'local',
    estado: 'jugada',
    fechaPrevista: `2026-10-0${numero}`,
    fechaHora: null,
    sede: null,
    numeroPistas: null,
    convocatoriaPublicada: false,
    marcador: null,
    ...cambios,
  };
}

async function pintar(
  confrontaciones: ConfrontacionNuestroEquipo[],
  estado: EstadoFase,
): Promise<HTMLElement> {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(FaseCalendarioComponent);
  fixture.componentRef.setInput('calendario', { fase, confrontaciones });
  fixture.componentRef.setInput('estado', estado);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('FaseCalendarioComponent', () => {
  it('una fase terminada sale plegada con su balance', async () => {
    const elemento = await pintar(
      [
        jornada(1, { marcador: { nuestros: 1, rival: 5 } }),
        jornada(2, { marcador: { nuestros: 3, rival: 3 } }),
        jornada(3, { marcador: { nuestros: 2, rival: 4 } }),
      ],
      'terminada',
    );
    const plegada = elemento.querySelector('details');
    expect(plegada?.open).toBe(false);
    expect(plegada?.querySelector('summary')?.textContent).toContain(
      'Terminada · 1 empate, 2 derrotas',
    );
    expect(plegada?.querySelectorAll('ctp-fila-calendario')).toHaveLength(3);
  });

  it('la fase en juego sale abierta, con la etiqueta de su estado', async () => {
    const elemento = await pintar([jornada(1)], 'en-juego');
    expect(elemento.querySelector('details')).toBeNull();
    expect(elemento.textContent).toContain('En juego');
  });

  it('una fase terminada con una jornada aplazada pendiente no se pliega', async () => {
    const elemento = await pintar(
      [jornada(1), jornada(2, { estado: 'aplazada', fechaPrevista: null })],
      'terminada',
    );
    expect(elemento.querySelector('details')).toBeNull();
  });

  it('sin resultados, la plegada solo dice que terminó', async () => {
    const elemento = await pintar([jornada(1)], 'terminada');
    expect(elemento.querySelector('.balance')?.textContent?.trim()).toBe('Terminada');
  });
});
