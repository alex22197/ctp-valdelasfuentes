import { TestBed } from '@angular/core/testing';
import type { FilaCuadricula } from '../../interfaces/fila-cuadricula.interface';
import { CuadriculaJornadasComponent } from './cuadricula-jornadas.component';

const fila: FilaCuadricula = {
  confrontacionId: 'j1',
  jornada: 1,
  rival: 'Soto Torrejón',
  condicion: 'visitante',
  marcador: '1-0',
  puntos: null,
  casillas: [
    { codigo: 'M1', nombre: 'Masculino 1', estado: 'ganado', esWo: true },
    { codigo: 'M2', nombre: 'Masculino 2', estado: 'pendiente', esWo: false },
  ],
};

async function crear(filas: FilaCuadricula[]) {
  const fixture = TestBed.createComponent(CuadriculaJornadasComponent);
  fixture.componentRef.setInput('filas', filas);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

const texto = (elemento: Element | null | undefined): string =>
  elemento?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe('CuadriculaJornadasComponent', () => {
  it('escribe WO en la casilla y lo explica a los lectores de pantalla', async () => {
    const elemento = await crear([fila]);
    const casillas = [...elemento.querySelectorAll('.casilla')];
    expect(casillas[0]?.classList).toContain('casilla--ganado');
    expect(texto(casillas[0]?.querySelector('[aria-hidden]'))).toBe('WO');
    expect(texto(casillas[0]?.querySelector('.solo-lector'))).toBe('Masculino 1: ganado por WO');
    expect(casillas[1]?.classList).toContain('casilla--pendiente');
  });

  it('dice «puntos pendientes» mientras falte algún partido y los puntos al acabar', async () => {
    expect(texto((await crear([fila])).querySelector('.puntos'))).toBe('puntos pendientes');
    expect(texto((await crear([{ ...fila, puntos: 1 }])).querySelector('.puntos'))).toBe('1 punto');
  });
});
