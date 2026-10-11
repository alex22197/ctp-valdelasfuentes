import { type ComponentFixture, TestBed } from '@angular/core/testing';
import type { MarcadorPartido } from '@data-access/resultados/interfaces/marcador-partido.interface';
import type { PartidoConResultado } from '@data-access/resultados/interfaces/partido-con-resultado.interface';
import { ResultadoPartidoComponent } from './resultado-partido.component';

const partido: PartidoConResultado = {
  tipo: 'masculino',
  numero: 1,
  reves: { id: 'sergio', nombreMostrar: 'Sergio' },
  drive: { id: 'jorge', nombreMostrar: 'Jorge' },
  marcador: { resultado: null, ganado: null, sets: [] },
};

class Tarjeta {
  readonly emitidos: MarcadorPartido[] = [];

  constructor(private readonly fixture: ComponentFixture<ResultadoPartidoComponent>) {
    fixture.componentInstance.guardar.subscribe((marcador) => this.emitidos.push(marcador));
  }

  get elemento(): HTMLElement {
    return this.fixture.nativeElement as HTMLElement;
  }

  async elegir(etiqueta: string): Promise<void> {
    const opcion = [...this.elemento.querySelectorAll('label.opcion')].find(
      (label) => label.textContent?.trim() === etiqueta,
    );
    opcion?.querySelector('input')?.dispatchEvent(new Event('change'));
    await this.fixture.whenStable();
  }

  async escribirJuegos(valores: readonly string[]): Promise<void> {
    const campos = this.elemento.querySelectorAll<HTMLInputElement>('ctp-campo-set input');
    valores.forEach((valor, indice) => {
      const campo = campos[indice]!;
      campo.value = valor;
      campo.dispatchEvent(new Event('input'));
    });
    await this.fixture.whenStable();
  }

  async enviar(): Promise<void> {
    this.elemento.querySelector('form')!.dispatchEvent(new Event('submit'));
    await this.fixture.whenStable();
  }
}

async function crearTarjeta(): Promise<Tarjeta> {
  const fixture = TestBed.createComponent(ResultadoPartidoComponent);
  fixture.componentRef.setInput('partido', partido);
  await fixture.whenStable();
  return new Tarjeta(fixture);
}

describe('ResultadoPartidoComponent', () => {
  it('muestra el partido y su pareja', async () => {
    const tarjeta = await crearTarjeta();
    expect(tarjeta.elemento.querySelector('h2')?.textContent).toContain('Masculino, pareja 1');
    expect(tarjeta.elemento.textContent).toContain('Sergio y Jorge');
  });

  it('emite el marcador cuando es válido', async () => {
    const tarjeta = await crearTarjeta();
    await tarjeta.elegir('Jugado');
    await tarjeta.escribirJuegos(['6', '4', '6', '3']);
    await tarjeta.enviar();

    expect(tarjeta.emitidos).toEqual([
      {
        resultado: 'normal',
        ganado: null,
        sets: [
          { juegosNuestros: 6, juegosRival: 4, tiebreakNuestros: null, tiebreakRival: null },
          { juegosNuestros: 6, juegosRival: 3, tiebreakNuestros: null, tiebreakRival: null },
        ],
      },
    ]);
  });

  it('no emite un marcador inválido y muestra el error junto a su set', async () => {
    const tarjeta = await crearTarjeta();
    await tarjeta.elegir('Jugado');
    await tarjeta.escribirJuegos(['6', '5', '6', '3']);
    await tarjeta.enviar();

    expect(tarjeta.emitidos).toHaveLength(0);
    const primerSet = tarjeta.elemento.querySelector('ctp-campo-set');
    expect(primerSet?.textContent).toContain('Con 6-5 el set no ha terminado');
  });

  it('avisa de un set imposible mientras se escribe, sin pulsar «Guardar»', async () => {
    const tarjeta = await crearTarjeta();
    await tarjeta.elegir('Jugado');
    await tarjeta.escribirJuegos(['7', '2']);
    expect(tarjeta.elemento.querySelector('ctp-campo-set .error')?.textContent).toContain(
      '7-2 no es posible',
    );
    expect(
      tarjeta.elemento.querySelector('ctp-campo-set input')?.getAttribute('aria-invalid'),
    ).toBe('true');
    expect(tarjeta.emitidos).toEqual([]);

    await tarjeta.escribirJuegos(['7', '5']);
    expect(tarjeta.elemento.querySelector('ctp-campo-set .error')).toBeNull();
  });
});
