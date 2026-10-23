import { TestBed } from '@angular/core/testing';
import type { CuentaPendiente } from '@data-access/gestores/interfaces/cuenta-pendiente.interface';
import type { DecisionCuenta } from '../../interfaces/decision-cuenta.interface';
import { CuentasNuevasComponent } from './cuentas-nuevas.component';

const cuenta: CuentaPendiente = {
  email: 'nueva@example.com',
  nombre: 'Nueva Persona',
  alta: '2026-10-21T18:00:00Z',
};

async function crear() {
  const fixture = TestBed.createComponent(CuentasNuevasComponent);
  fixture.componentRef.setInput('cuentas', [cuenta]);
  const aceptadas: DecisionCuenta[] = [];
  const descartadas: CuentaPendiente[] = [];
  fixture.componentInstance.aceptar.subscribe((d) => aceptadas.push(d));
  fixture.componentInstance.descartar.subscribe((c) => descartadas.push(c));
  await fixture.whenStable();
  const elemento = fixture.nativeElement as HTMLElement;
  const boton = (texto: string) =>
    [...elemento.querySelectorAll('button')].find((b) => b.textContent?.trim().startsWith(texto));
  const pulsar = async (texto: string) => {
    boton(texto)?.click();
    await fixture.whenStable();
  };
  return { elemento, boton, pulsar, aceptadas, descartadas };
}

describe('CuentasNuevasComponent', () => {
  it('enseña el nombre, el correo y cuándo entró', async () => {
    const { elemento } = await crear();
    expect(elemento.querySelector('.nombre')?.textContent?.trim()).toBe('Nueva Persona');
    expect(elemento.querySelector('.datos')?.textContent).toContain('nueva@example.com');
    expect(elemento.querySelector('.datos')?.textContent).toContain('entró el 21 de octubre');
  });

  it('hace capitán de una vez', async () => {
    const { pulsar, aceptadas } = await crear();
    await pulsar('Hacer capitán');
    expect(aceptadas).toEqual([{ cuenta, rol: 'capitan' }]);
  });

  it('pide confirmación antes de hacer administrador', async () => {
    const { pulsar, aceptadas, boton } = await crear();
    await pulsar('Hacer administrador');
    expect(aceptadas).toEqual([]);
    expect(boton('Sí, administrador')).toBeDefined();
    await pulsar('Sí, administrador');
    expect(aceptadas).toEqual([{ cuenta, rol: 'admin' }]);
  });

  it('descarta', async () => {
    const { pulsar, descartadas } = await crear();
    await pulsar('Descartar');
    expect(descartadas).toEqual([cuenta]);
  });
});
