import { TestBed } from '@angular/core/testing';
import type { GrupoOpciones } from '../../interfaces/grupo-opciones.interface';
import { SelectorJugadoresComponent } from './selector-jugadores.component';

const grupos: GrupoOpciones[] = [
  {
    estado: 'pueden',
    titulo: 'Pueden',
    opciones: [
      { id: 'alvaro', nombre: 'Álvaro', iniciales: 'Ál', estado: 'pueden', otraPista: 'M2' },
      { id: 'walter', nombre: 'Walter', iniciales: 'Wa', estado: 'pueden', otraPista: null },
    ],
  },
];

async function crear() {
  // jsdom no implementa los diálogos modales: se simulan para que el componente los abra.
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
  const fixture = TestBed.createComponent(SelectorJugadoresComponent);
  fixture.componentRef.setInput('abierto', true);
  fixture.componentRef.setInput('titulo', 'Revés de Masculino, pareja 1');
  fixture.componentRef.setInput('grupos', grupos);
  fixture.componentRef.setInput('idSeleccionado', 'walter');
  const elegidos: (string | null)[] = [];
  let cerrado = false;
  fixture.componentInstance.elegir.subscribe((id) => elegidos.push(id));
  fixture.componentInstance.cerrar.subscribe(() => (cerrado = true));
  await fixture.whenStable();
  const elemento = fixture.nativeElement as HTMLElement;
  return { fixture, elemento, elegidos, cerrado: () => cerrado };
}

const textoDe = (elemento: Element): string =>
  elemento.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe('SelectorJugadoresComponent', () => {
  it('abre el panel con los jugadores, la otra pista y el elegido marcado', async () => {
    const { elemento } = await crear();
    const opciones = [...elemento.querySelectorAll<HTMLButtonElement>('.opcion')];
    expect(elemento.querySelector('dialog')?.hasAttribute('open')).toBe(true);
    const parte = (opcion: Element, clase: string): string | null =>
      opcion.querySelector(clase) ? textoDe(opcion.querySelector(clase)!) : null;
    expect(
      opciones.map((o) => [parte(o, '.avatar'), parte(o, '.nombre'), parte(o, '.otra-pista')]),
    ).toEqual([
      ['Ál', 'Álvaro', ', ya juega en en M2'],
      ['Wa', 'Walter', null],
    ]);
    expect(opciones[1]?.getAttribute('aria-pressed')).toBe('true');
  });

  it('emite el jugador tocado, y null al dejar el lado sin asignar', async () => {
    const { elemento, elegidos } = await crear();
    elemento.querySelector<HTMLButtonElement>('.opcion')!.click();
    elemento.querySelector<HTMLButtonElement>('.dejar-vacio')!.click();
    expect(elegidos).toEqual(['alvaro', null]);
  });

  it('filtra al buscar y avisa si no hay nadie', async () => {
    const { fixture, elemento } = await crear();
    const buscador = elemento.querySelector<HTMLInputElement>('input[type="search"]')!;
    buscador.value = 'walt';
    buscador.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect([...elemento.querySelectorAll('.opcion')].map(textoDe)).toEqual(['Wa Walter']);

    buscador.value = 'zzz';
    buscador.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(elemento.textContent).toContain('Nadie se llama así');
  });

  it('se cierra con el botón Cerrar', async () => {
    const { elemento, cerrado } = await crear();
    elemento.querySelector<HTMLButtonElement>('.cerrar')!.click();
    expect(cerrado()).toBe(true);
  });
});
