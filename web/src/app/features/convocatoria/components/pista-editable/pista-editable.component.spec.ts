import { TestBed } from '@angular/core/testing';
import type { HuecoAlineacion } from '../../interfaces/hueco-alineacion.interface';
import type { PosicionHueco } from '../../interfaces/posicion-hueco.interface';
import { PistaEditableComponent } from './pista-editable.component';

const nombres = new Map([['sergio', 'Sergio']]);

async function crear(hueco: HuecoAlineacion, errores: string[] = []) {
  const fixture = TestBed.createComponent(PistaEditableComponent);
  fixture.componentRef.setInput('hueco', hueco);
  fixture.componentRef.setInput('nombres', nombres);
  fixture.componentRef.setInput('errores', errores);
  const abiertos: PosicionHueco[] = [];
  fixture.componentInstance.abrir.subscribe((posicion) => abiertos.push(posicion));
  await fixture.whenStable();
  const elemento = fixture.nativeElement as HTMLElement;
  return { elemento, abiertos, fichas: [...elemento.querySelectorAll('button')] };
}

const masculino1: HuecoAlineacion = {
  tipo: 'masculino',
  numero: 1,
  idReves: 'sergio',
  idDrive: null,
  bloqueado: false,
};

describe('PistaEditableComponent', () => {
  it('muestra la ficha del jugador y un hueco para elegir', async () => {
    const { fichas } = await crear(masculino1);
    const parte = (ficha: Element, clase: string): string | undefined =>
      ficha.querySelector(clase)?.textContent?.trim();
    expect(
      fichas.map((f) => [parte(f, '.avatar'), parte(f, '.nombre'), parte(f, '.posicion')]),
    ).toEqual([
      ['Se', 'Sergio', 'Revés'],
      ['+', 'Elegir', 'Drive'],
    ]);
    expect(fichas[0]?.getAttribute('aria-label')).toBe(
      'Revés de Masculino, pareja 1: Sergio. Cambiar',
    );
    expect(fichas[1]?.getAttribute('aria-label')).toBe(
      'Drive de Masculino, pareja 1: sin asignar. Elegir',
    );
  });

  it('pide abrir el panel del lado tocado', async () => {
    const { fichas, abiertos } = await crear(masculino1);
    fichas[1]!.click();
    expect(abiertos).toEqual([{ clave: 'masculino-1', lado: 'drive' }]);
  });

  it('bloquea la pista con WO en contra y muestra sus errores', async () => {
    const { elemento, fichas } = await crear({ ...masculino1, bloqueado: true }, [
      'Sergio ya juega en Mixto',
    ]);
    expect(fichas).toHaveLength(0);
    expect(elemento.textContent).toContain('WO en contra');
    expect(elemento.textContent).toContain('Sergio ya juega en Mixto.');
  });
});
