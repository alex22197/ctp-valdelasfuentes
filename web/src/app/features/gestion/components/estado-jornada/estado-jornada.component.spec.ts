import { TestBed } from '@angular/core/testing';
import type { EstadoPorJugar } from '@data-access/confrontaciones/interfaces/estado-por-jugar.type';
import type { EstadoAccion } from '@shared/utils/interfaces/estado-accion.type';
import { EstadoJornadaComponent } from './estado-jornada.component';

async function crear(estado: EstadoPorJugar, accion?: EstadoAccion) {
  const fixture = TestBed.createComponent(EstadoJornadaComponent);
  fixture.componentRef.setInput('estado', estado);
  fixture.componentRef.setInput('contra', "contra Pa'delante");
  if (accion) {
    fixture.componentRef.setInput('accion', accion);
  }
  const pedidos: EstadoPorJugar[] = [];
  fixture.componentInstance.cambiar.subscribe((destino) => pedidos.push(destino));
  await fixture.whenStable();
  const elemento = fixture.nativeElement as HTMLElement;
  const botones = () => [...elemento.querySelectorAll('button')];
  const boton = (texto: string) =>
    botones().find((b) => b.textContent?.trim().startsWith(texto)) ?? null;
  const pulsar = async (texto: string) => {
    boton(texto)?.click();
    await fixture.whenStable();
  };
  return { elemento, botones, boton, pulsar, pedidos };
}

describe('EstadoJornadaComponent', () => {
  it('aplazar pide confirmación antes de cambiar nada', async () => {
    const { pulsar, pedidos, elemento } = await crear('programada');
    await pulsar('Aplazar');
    expect(pedidos).toEqual([]);
    expect(elemento.textContent).toContain('¿Aplazar la jornada? Se borra su fecha');
    await pulsar('Sí, aplazar');
    expect(pedidos).toEqual(['aplazada']);
  });

  it('cancelar vuelve a los botones sin cambiar nada', async () => {
    const { pulsar, pedidos, boton } = await crear('programada');
    await pulsar('Suspender');
    await pulsar('Cancelar');
    expect(pedidos).toEqual([]);
    expect(boton('Aplazar')).not.toBeNull();
  });

  it('quitar el aplazamiento es inmediato', async () => {
    const { pulsar, pedidos } = await crear('aplazada');
    await pulsar('Quitar el aplazamiento');
    expect(pedidos).toEqual(['programada']);
  });

  it('nombra la jornada para los lectores de pantalla', async () => {
    const { boton } = await crear('programada');
    expect(boton('Aplazar')?.textContent).toContain("la jornada contra Pa'delante");
  });

  it('mientras guarda, los botones no se pueden pulsar', async () => {
    const { botones } = await crear('suspendida', { tipo: 'en-curso' });
    expect(botones().every((b) => b.disabled)).toBe(true);
  });

  it('enseña el error que llega', async () => {
    const { elemento } = await crear('programada', {
      tipo: 'error',
      mensaje: 'La jornada ya está terminada: no se puede aplazar ni suspender',
    });
    expect(elemento.querySelector('[role="alert"]')?.textContent).toContain('ya está terminada');
  });
});
