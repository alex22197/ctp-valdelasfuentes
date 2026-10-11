import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { URL_NORMATIVA } from '@core/config/sitio.constants';
import { ReglamentoPageComponent } from './reglamento-page.component';

const ANCLAS = [
  'jornada',
  'quien-juega',
  'alineacion',
  'partido',
  'puntos',
  'wo',
  'lluvia',
  'acta',
  'fases',
  'masters',
  'quien-decide',
];

async function crear(fragmento: string | null) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: ActivatedRoute, useValue: { fragment: new BehaviorSubject(fragmento) } },
    ],
  });
  const fixture = TestBed.createComponent(ReglamentoPageComponent);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('ReglamentoPageComponent', () => {
  it('tiene una sección desplegable por tema, cada una con su ancla y su título', async () => {
    const pagina = await crear(null);
    const secciones = [...pagina.querySelectorAll('details')];
    expect(secciones.map((s) => s.id)).toEqual(ANCLAS);
    expect(secciones.every((s) => s.querySelector('summary h2')?.textContent?.trim())).toBe(true);
    expect(secciones.some((s) => s.open)).toBe(false);
  });

  it('el índice enlaza con todas las secciones', async () => {
    const pagina = await crear(null);
    const enlaces = [...pagina.querySelectorAll<HTMLAnchorElement>('.indice a')];
    expect(enlaces.map((a) => a.hash.slice(1))).toEqual(ANCLAS);
  });

  it('abre la sección a la que apunta la dirección', async () => {
    const pagina = await crear('wo');
    const abiertas = [...pagina.querySelectorAll('details')].filter((s) => s.open);
    expect(abiertas.map((s) => s.id)).toEqual(['wo']);
  });

  it('enlaza con el PDF oficial', async () => {
    const pagina = await crear(null);
    const enlaces = [...pagina.querySelectorAll<HTMLAnchorElement>('a')].map((a) => a.href);
    expect(enlaces).toContain(URL_NORMATIVA);
  });
});
