import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { PartidoAlineacion } from '@data-access/alineaciones/interfaces/partido-alineacion.interface';
import { ConvocatoriaJornadaComponent } from './convocatoria-jornada.component';

const partidos: PartidoAlineacion[] = [
  {
    id: 'f2',
    tipo: 'femenino',
    numero: 2,
    reves: { id: 'marta', nombreMostrar: 'Marta Morales' },
    drive: { id: 'jess', nombreMostrar: 'Jess' },
  },
  {
    id: 'x1',
    tipo: 'mixto',
    numero: 1,
    reves: { id: 'rocio', nombreMostrar: 'Rocio' },
    drive: null,
  },
];

async function crear() {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(ConvocatoriaJornadaComponent);
  fixture.componentRef.setInput('partidos', partidos);
  fixture.componentRef.setInput('idsComodines', new Set(['jess']));
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('ConvocatoriaJornadaComponent', () => {
  it('enlaza cada nombre con su ficha, salvo los comodines y los huecos', async () => {
    const elemento = await crear();
    const enlaces = [...elemento.querySelectorAll('a')].map((a) => [
      a.textContent?.trim(),
      a.getAttribute('href'),
    ]);
    expect(enlaces).toEqual([
      ['Marta Morales', '/jugadores/marta'],
      ['Rocio', '/jugadores/rocio'],
    ]);
    expect(elemento.textContent).toContain('Jess');
    expect(elemento.textContent).toContain('Sin asignar');
  });
});
