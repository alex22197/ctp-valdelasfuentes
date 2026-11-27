import { TestBed } from '@angular/core/testing';
import type { EstadoLecturaLiga } from '../../interfaces/estado-lectura-liga.type';
import { LecturaLigaComponent } from './lectura-liga.component';

async function pintar(estado: EstadoLecturaLiga): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(LecturaLigaComponent);
  fixture.componentRef.setInput('estado', estado);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('LecturaLigaComponent', () => {
  it('al día es una línea con la fecha en hora de Madrid', async () => {
    const elemento = await pintar({ tipo: 'al-dia', fecha: '2026-11-25T14:03:00Z' });
    expect(elemento.textContent).toContain('leídos el miércoles 25 de noviembre, 15:03');
    expect(elemento.querySelector('[role="alert"]')).toBeNull();
  });

  it('un fallo se anuncia con sus errores', async () => {
    const elemento = await pintar({
      tipo: 'error',
      fecha: '2026-11-25T14:03:00Z',
      errores: ['Clausura: permission denied'],
    });
    const alerta = elemento.querySelector('[role="alert"]');
    expect(alerta?.textContent).toContain('La lectura de la liga falló');
    expect(alerta?.textContent).toContain('Clausura: permission denied');
  });

  it('sin leer dice cuántos días y dónde mirarlo', async () => {
    const elemento = await pintar({ tipo: 'sin-leer', ultima: '2026-11-17T11:09:00Z', dias: 10 });
    const alerta = elemento.querySelector('[role="alert"]');
    expect(alerta?.textContent).toContain('desde hace 10 días');
    expect(alerta?.textContent).toContain('GitHub Actions');
  });

  it('los avisos van en una lista', async () => {
    const elemento = await pintar({
      tipo: 'avisos',
      fecha: '2026-11-25T14:03:00Z',
      avisos: ['El marcador no coincide', 'Faltan partidos'],
    });
    expect(elemento.querySelectorAll('li')).toHaveLength(2);
  });
});
