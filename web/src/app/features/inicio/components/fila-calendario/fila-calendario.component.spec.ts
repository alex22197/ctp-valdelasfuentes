import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import { FilaCalendarioComponent } from './fila-calendario.component';

const HOY = '2026-11-27';
const rival = { id: 'r', nombre: 'Bamvolea Punta Chica A', esNuestro: false };
const nosotros = { id: 'n', nombre: 'CTPA Valdelasfuentes', esNuestro: true };

function jornada(cambios: Partial<ConfrontacionNuestroEquipo> = {}): ConfrontacionNuestroEquipo {
  return {
    id: 'c3',
    jornada: 3,
    local: rival,
    visitante: nosotros,
    rival,
    condicion: 'visitante',
    estado: 'programada',
    fechaPrevista: null,
    fechaHora: '2026-11-28T14:00:00Z',
    sede: null,
    numeroPistas: null,
    convocatoriaPublicada: false,
    marcador: null,
    ...cambios,
  };
}

async function pintar(
  datos: ConfrontacionNuestroEquipo,
  entradas: Record<string, unknown> = {},
): Promise<HTMLElement> {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(FilaCalendarioComponent);
  fixture.componentRef.setInput('jornada', datos);
  fixture.componentRef.setInput('hoy', HOY);
  for (const [nombre, valor] of Object.entries(entradas)) {
    fixture.componentRef.setInput(nombre, valor);
  }
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

const texto = (elemento: Element | null | undefined): string =>
  elemento?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe('FilaCalendarioComponent', () => {
  it('enseña el rival, la fecha corta y si es en casa o fuera', async () => {
    const fila = await pintar(jornada());
    expect(texto(fila.querySelector('.numero'))).toBe('J3');
    expect(texto(fila.querySelector('.rival'))).toBe('Jornada 3 contra Bamvolea Punta Chica A');
    expect(texto(fila.querySelector('.detalle'))).toBe('Sáb 28 nov · 15:00 · Fuera');
  });

  it('sin número de jornada usa el nombre de la eliminatoria', async () => {
    const fila = await pintar(jornada({ jornada: null }), { sinNumero: 'Reto' });
    expect(texto(fila.querySelector('.numero'))).toBe('Reto');
    expect(texto(fila.querySelector('.rival'))).toContain('Reto contra');
  });

  it('una victoria va en una ficha verde que lo dice', async () => {
    const jugada = jornada({ estado: 'jugada', marcador: { nuestros: 4, rival: 2 } });
    const ficha = (await pintar(jugada, { disputada: true })).querySelector('.ficha');
    expect(ficha?.classList.contains('ficha--victoria')).toBe(true);
    expect(texto(ficha?.querySelector('.solo-lector'))).toBe('Victoria, 4 a 2');
  });

  it('un empate, en una ficha neutra', async () => {
    const jugada = jornada({ estado: 'jugada', marcador: { nuestros: 3, rival: 3 } });
    const ficha = (await pintar(jugada, { disputada: true })).querySelector('.ficha');
    expect(ficha?.classList.contains('ficha--empate')).toBe(true);
    expect(texto(ficha?.querySelector('.solo-lector'))).toBe('Empate, 3 a 3');
  });

  it('una derrota, en una ficha roja', async () => {
    const jugada = jornada({ estado: 'jugada', marcador: { nuestros: 1, rival: 5 } });
    const ficha = (await pintar(jugada, { disputada: true })).querySelector('.ficha');
    expect(ficha?.classList.contains('ficha--derrota')).toBe(true);
    expect(texto(ficha?.querySelector('.solo-lector'))).toBe('Derrota, 1 a 5');
  });

  it('destaca el próximo partido', async () => {
    const fila = await pintar(jornada(), { proxima: true });
    expect(fila.querySelector('.fila--proxima')).not.toBeNull();
    expect(texto(fila.querySelector('.etiqueta--proxima'))).toBe('Próximo');
  });

  it('una aplazada lleva su etiqueta', async () => {
    const fila = await pintar(jornada({ estado: 'aplazada', fechaHora: null }));
    expect(texto(fila.querySelector('.etiqueta--aviso'))).toBe('Aplazada');
    expect(texto(fila.querySelector('.detalle'))).toBe('Fecha por confirmar · Fuera');
  });

  it('si ya pasó su día y no hay marcador, lo dice', async () => {
    const pasada = jornada({ fechaHora: '2026-11-22T12:30:00Z' });
    const fila = await pintar(pasada, { disputada: true });
    expect(texto(fila.querySelector('.etiqueta'))).toBe('Sin resultado');
  });

  it('sin permisos de gestor no hay enlaces', async () => {
    const fila = await pintar(jornada());
    expect(fila.querySelectorAll('a')).toHaveLength(0);
  });

  it('a un gestor le ofrece solo lo que toca', async () => {
    const fila = await pintar(jornada(), { enlacesGestion: true });
    const enlaces = [...fila.querySelectorAll('a')];
    expect(enlaces.map((a) => a.getAttribute('href'))).toEqual(['/convocatoria/c3']);
    expect(texto(enlaces[0])).toBe('Convocatoria contra Bamvolea Punta Chica A');
  });
});
