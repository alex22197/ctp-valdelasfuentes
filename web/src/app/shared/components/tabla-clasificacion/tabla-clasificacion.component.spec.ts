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
});
