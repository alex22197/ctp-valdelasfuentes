import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Router,
  UrlTree,
  provideRouter,
  type ActivatedRouteSnapshot,
  type RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { gestorGuard } from './gestor.guard';

function ejecutarGuard(esGestor: boolean): Promise<unknown> {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      {
        provide: AuthService,
        useValue: { esGestor: signal(esGestor), esperarInicializacion: () => Promise.resolve() },
      },
    ],
  });
  return TestBed.runInInjectionContext(() =>
    gestorGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  ) as Promise<unknown>;
}

describe('gestorGuard', () => {
  it('deja pasar a un gestor', async () => {
    expect(await ejecutarGuard(true)).toBe(true);
  });

  it('manda a la página de acceso a quien no es gestor', async () => {
    const resultado = await ejecutarGuard(false);
    expect(resultado).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe('/acceso');
  });
});
