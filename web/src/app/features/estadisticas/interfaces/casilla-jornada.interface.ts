import type { EstadoCasilla } from './estado-casilla.type';

/** Uno de los partidos de una jornada en «Jornada a jornada». */
export interface CasillaJornada {
  /** «Masculino, pareja 2» o «Mixto»: para lectores de pantalla. */
  readonly nombre: string;
  /** «Pareja 2»; `null` en el mixto, que es uno solo. */
  readonly etiqueta: string | null;
  readonly estado: EstadoCasilla;
  /** «Pablo y Iván»; `null` si no consta quién jugó. */
  readonly pareja: string | null;
  /** Cada set desde nuestro lado: «6-3». Vacío en los WO y en los que están por jugar. */
  readonly sets: readonly string[];
  /** Lo que explica un resultado sin sets o raro: «WO», «Abandono», «Suspendido». */
  readonly nota: string | null;
}
