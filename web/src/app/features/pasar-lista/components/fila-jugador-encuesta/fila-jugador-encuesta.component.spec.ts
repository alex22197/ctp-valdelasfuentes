import { TestBed } from '@angular/core/testing';
import type { JugadorEncuesta } from '@data-access/disponibilidad/interfaces/jugador-encuesta.interface';
import type { RespuestaEncuesta } from '@data-access/disponibilidad/interfaces/respuesta-encuesta.type';
import { FilaJugadorEncuestaComponent } from './fila-jugador-encuesta.component';

const sergio: JugadorEncuesta = {
  id: 'sergio',
  nombreMostrar: 'Sergio',
  sexo: 'masculino',
  respuesta: 'si',
  convocado: true,
};

async function crear(guardando = false) {
  const fixture = TestBed.createComponent(FilaJugadorEncuestaComponent);
  fixture.componentRef.setInput('jugador', sergio);
  fixture.componentRef.setInput('guardando', guardando);
  const emitidas: (RespuestaEncuesta | null)[] = [];
  fixture.componentInstance.responder.subscribe((respuesta) => emitidas.push(respuesta));
  await fixture.whenStable();
  const elemento = fixture.nativeElement as HTMLElement;
  const radios = [...elemento.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
  return { elemento, radios, emitidas };
}

describe('FilaJugadorEncuestaComponent', () => {
  it('marca la respuesta actual y avisa de que está convocado', async () => {
    const { elemento, radios } = await crear();
    expect(radios.map((radio) => radio.checked)).toEqual([true, false, false]);
    expect(elemento.textContent).toContain('Convocado');
  });

  it('emite la respuesta tocada, «?» como null', async () => {
    const { radios, emitidas } = await crear();
    radios[1]!.dispatchEvent(new Event('change'));
    radios[2]!.dispatchEvent(new Event('change'));
    expect(emitidas).toEqual(['no', null]);
  });

  it('bloquea los botones mientras se guarda', async () => {
    const { radios } = await crear(true);
    expect(radios.every((radio) => radio.disabled)).toBe(true);
  });
});
