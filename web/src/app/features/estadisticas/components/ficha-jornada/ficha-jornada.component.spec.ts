import { TestBed } from '@angular/core/testing';
import type { FilaCuadricula } from '../../interfaces/fila-cuadricula.interface';
import { FichaJornadaComponent } from './ficha-jornada.component';

const fila: FilaCuadricula = {
  confrontacionId: 'j1',
  jornada: 1,
  rival: 'Soto Torrejón',
  condicion: 'visitante',
  marcador: '1-1',
  puntos: null,
  grupos: [
    {
      tipo: 'masculino',
      nombre: 'Masculino',
      casillas: [
        {
          nombre: 'Masculino, pareja 1',
          etiqueta: 'Pareja 1',
          estado: 'ganado',
          pareja: 'Pablo y Iván',
          sets: ['6-3', '6-4'],
          nota: null,
        },
        {
          nombre: 'Masculino, pareja 2',
          etiqueta: 'Pareja 2',
          estado: 'perdido',
          pareja: null,
          sets: [],
          nota: 'WO',
        },
      ],
    },
    {
      tipo: 'mixto',
      nombre: 'Mixto',
      casillas: [
        {
          nombre: 'Mixto',
          etiqueta: null,
          estado: 'pendiente',
          pareja: null,
          sets: [],
          nota: null,
        },
      ],
    },
  ],
};

async function crear(datos: FilaCuadricula, abierta = false) {
  const fixture = TestBed.createComponent(FichaJornadaComponent);
  fixture.componentRef.setInput('fila', datos);
  fixture.componentRef.setInput('abierta', abierta);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

/** El texto de cada elemento por separado, como lo lee un lector de pantalla. */
function texto(elemento: Element | null | undefined): string {
  if (!elemento) {
    return '';
  }
  const recorrido = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT);
  const partes: string[] = [];
  while (recorrido.nextNode()) {
    partes.push(recorrido.currentNode.textContent ?? '');
  }
  return partes.join(' ').replace(/\s+/g, ' ').trim();
}

describe('FichaJornadaComponent', () => {
  it('resume la jornada en la cabecera, también para lectores de pantalla', async () => {
    const elemento = await crear(fila);
    expect(texto(elemento.querySelector('.rival'))).toBe('Soto Torrejón fuera');
    expect(texto(elemento.querySelector('.marcador'))).toBe(
      '1-1 1 partido ganado y 1 perdido, puntos pendientes',
    );
    const recuadros = [...elemento.querySelectorAll('.recuadro')];
    expect(recuadros.map((r) => r.className.match(/recuadro--(\w+)/)?.[1])).toEqual([
      'ganado',
      'perdido',
      'pendiente',
    ]);
    expect([...elemento.querySelectorAll('.tramo .categoria')].map(texto)).toEqual([
      'Masculino',
      'Mixto',
    ]);
  });

  it('cada partido dice quién jugó y cómo quedó', async () => {
    const elemento = await crear(fila, true);
    expect(elemento.querySelector('details')?.open).toBe(true);
    const partidos = [...elemento.querySelectorAll('.partido')];
    const parte = (i: number, clase: string) => texto(partidos[i]?.querySelector(clase));
    expect(parte(0, '.quien')).toBe('Pareja 1 Pablo y Iván');
    expect(parte(0, '.resultado')).toBe('Ganado: 6-3 · 6-4');
    expect(parte(0, '.insignia')).toBe('✓');
    expect(parte(1, '.quien')).toBe('Pareja 2 Sin pareja apuntada');
    expect(parte(1, '.resultado')).toBe('Perdido: WO');
    expect(parte(2, '.quien')).toBe('Mixto Sin pareja apuntada');
    expect(parte(2, '.resultado')).toBe('Por jugar: Por jugar');
  });

  it('dice los puntos cuando la jornada ha terminado', async () => {
    const elemento = await crear({ ...fila, puntos: 1 });
    expect(texto(elemento.querySelector('.puntos'))).toBe('1 punto');
  });
});
