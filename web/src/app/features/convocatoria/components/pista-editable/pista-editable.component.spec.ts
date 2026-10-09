import { TestBed } from '@angular/core/testing';
import type { CambioHueco } from '../../interfaces/cambio-hueco.interface';
import type { HuecoAlineacion } from '../../interfaces/hueco-alineacion.interface';
import { PistaEditableComponent } from './pista-editable.component';

const opciones = [
  {
    titulo: 'Pueden',
    opciones: [
      { id: 'sergio', etiqueta: 'Sergio' },
      { id: 'jorge', etiqueta: 'Jorge' },
    ],
  },
];

async function crear(hueco: HuecoAlineacion, errores: string[] = []) {
  const fixture = TestBed.createComponent(PistaEditableComponent);
  fixture.componentRef.setInput('hueco', hueco);
  fixture.componentRef.setInput('opciones', opciones);
  fixture.componentRef.setInput('errores', errores);
  const cambios: CambioHueco[] = [];
  fixture.componentInstance.cambiar.subscribe((cambio) => cambios.push(cambio));
  await fixture.whenStable();
  return { elemento: fixture.nativeElement as HTMLElement, cambios };
}

const masculino1: HuecoAlineacion = {
  tipo: 'masculino',
  numero: 1,
  idReves: 'sergio',
  idDrive: null,
  bloqueado: false,
};

describe('PistaEditableComponent', () => {
  it('muestra a cada jugador en su lado', async () => {
    const { elemento } = await crear(masculino1);
    const [reves, drive] = [...elemento.querySelectorAll('select')];
    expect(reves?.value).toBe('sergio');
    expect(drive?.value).toBe('');
  });

  it('emite el jugador elegido, y null al dejar el lado sin asignar', async () => {
    const { elemento, cambios } = await crear(masculino1);
    const [reves, drive] = [...elemento.querySelectorAll('select')];
    drive!.value = 'jorge';
    drive!.dispatchEvent(new Event('change'));
    reves!.value = '';
    reves!.dispatchEvent(new Event('change'));
    expect(cambios).toEqual([
      { clave: 'masculino-1', lado: 'drive', idJugador: 'jorge' },
      { clave: 'masculino-1', lado: 'reves', idJugador: null },
    ]);
  });

  it('bloquea la pista con WO en contra y muestra sus errores', async () => {
    const { elemento } = await crear({ ...masculino1, bloqueado: true }, [
      'Sergio ya juega en Mixto',
    ]);
    expect(elemento.querySelectorAll('select')).toHaveLength(0);
    expect(elemento.textContent).toContain('WO en contra');
    expect(elemento.textContent).toContain('Sergio ya juega en Mixto.');
  });
});
