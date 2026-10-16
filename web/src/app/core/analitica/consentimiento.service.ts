import { Injectable, computed, signal } from '@angular/core';
import { guardarConsentimiento, leerConsentimiento } from './consentimiento';
import type { EstadoConsentimiento } from './interfaces/estado-consentimiento.type';

const CLAVE = 'ctp-consentimiento-analitica';

/**
 * Si el visitante deja medir sus visitas. La elección se guarda en su navegador (es lo único
 * que se guarda si rechaza) y se puede cambiar cuando quiera desde el pie de la página.
 */
@Injectable({ providedIn: 'root' })
export class ConsentimientoService {
  private readonly elegido = signal<EstadoConsentimiento>(leerGuardado());
  private readonly reabierto = signal(false);

  readonly estado = this.elegido.asReadonly();
  /** El aviso sale mientras no se haya elegido y cuando se pide cambiar la elección. */
  readonly avisoVisible = computed(() => this.elegido() === 'pendiente' || this.reabierto());
  /** Si el aviso está abierto porque se ha pedido, para llevar el foco a él. */
  readonly avisoReabierto = this.reabierto.asReadonly();

  aceptar(): void {
    this.decidir('aceptado');
  }

  rechazar(): void {
    this.decidir('rechazado');
  }

  reabrir(): void {
    this.reabierto.set(true);
  }

  private decidir(estado: 'aceptado' | 'rechazado'): void {
    this.elegido.set(estado);
    this.reabierto.set(false);
    try {
      localStorage.setItem(CLAVE, guardarConsentimiento(estado, new Date()));
    } catch {
      // Sin almacenamiento (ventana privada, datos bloqueados): vale para esta visita.
    }
  }
}

function leerGuardado(): EstadoConsentimiento {
  try {
    return leerConsentimiento(localStorage.getItem(CLAVE), new Date());
  } catch {
    return 'pendiente';
  }
}
