import { TestBed } from '@angular/core/testing';
import type { FilaClasificacion } from '@data-access/clasificacion/interfaces/fila-clasificacion.interface';
import { TablaClasificacionComponent } from './tabla-clasificacion.component';

function fila(posicion: number, nombre: string, esNuestro: boolean): FilaClasificacion {
  return {
    posicion,
    equipo: { id: nombre, nombre, esNuestro },
    puntos: 0,
    ganados: 0,
    empatados: 0,
    perdidos: 0,
    partidosFavor: posicion === 1 ? 8 : null,
    partidosContra: posicion === 1 ? 4 : null,
    actualizadaEn: null,
  };
}

describe('TablaClasificacionComponent', () => {
  it('pinta una fila por equipo y resalta la nuestra', async () => {
    const fixture = TestBed.createComponent(TablaClasificacionComponent);
    fixture.componentRef.setInput('filas', [
      fila(1, 'CTPA Valdelasfuentes', true),
      fila(2, 'Soto Torrejón', false),
    ]);
    await fixture.whenStable();

    const filas = (fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr');
    expect(filas).toHaveLength(2);
    expect(filas[0]?.classList).toContain('fila--nuestra');
    expect(filas[1]?.classList).not.toContain('fila--nuestra');
    expect(filas[1]?.textContent).toContain('Soto Torrejón');
  });

  it('pone los partidos a favor y en contra juntos, o una raya si no se saben', async () => {
    const fixture = TestBed.createComponent(TablaClasificacionComponent);
    fixture.componentRef.setInput('filas', [
      fila(1, 'Padel Attraction B', false),
      fila(2, 'Soto', false),
    ]);
    await fixture.whenStable();
    const celdas = (fixture.nativeElement as HTMLElement).querySelectorAll('td.columna-partidos');
    expect(celdas[0]?.querySelector('[aria-hidden]')?.textContent).toBe('8-4');
    expect(celdas[0]?.querySelector('.solo-lector')?.textContent).toBe('8 a favor y 4 en contra');
    expect(celdas[1]?.textContent?.trim()).toBe('–');
  });
});
