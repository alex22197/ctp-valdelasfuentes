# Normativa de la Liga MasterPadel (resumen)

Resumen de las reglas que afectan a la web, sacado de la
[normativa oficial](https://ligamasterpadel.lansoft.es/pdf/normativa.pdf) al empezar el
proyecto. **Ante cualquier duda manda el PDF**, que la liga puede actualizar. Junto a cada regla
se indica dónde se aplica en el proyecto.

## Plantilla

- Entre **16 y 40 jugadores** por equipo: mínimo **10 hombres y 6 mujeres**, máximo
  **24 hombres y 16 mujeres**. Edad mínima: **13 años**.
- Dos ventanas de **altas** de hasta **8 jugadores** cada una durante la primera vuelta. Las
  altas se publican en la web de la liga.
- Solo pueden jugar jugadores **inscritos** en el equipo; si el rival lo reclama, se pierde el
  partido. → `plantilla.inscrito_oficial` y aviso al convocar comodines.
- Equipos filiales: un jugador solo puede subir al equipo inmediatamente superior (del C al B,
  no al A) y nunca jugar dos confrontaciones en la misma jornada. _(No aplica: el club tiene
  un solo equipo.)_

## Confrontación

- Cada jornada entre dos equipos tiene **6 partidos**: masculino 1, 2 y 3; femenino 1 y 2;
  mixto. → `competicion.formato` y trigger `validar_partido`.
- Quien juega el **mixto no puede jugar otro partido** en esa confrontación; en general, nadie
  juega dos partidos. → trigger `validar_participacion`.
- Si hay menos de 6 pistas, el orden de juego es **F1, M1, Mixto, F2, M2, M3**.
  → `confrontacion.num_pistas`.
- Partidos al **mejor de 3 sets**, con **tie-break en todos los sets** y **punto de oro**.
  → `set_partido` (juegos de 0 a 7, tie-break solo en 7-6).
- Si una pareja no se presenta (**WO**), las parejas «corren hacia arriba»: el WO siempre recae
  en la última pareja de ese tipo.
- Los partidos **suspendidos** se reanudan con el marcador que llevaban.
  → `partido.resultado = 'suspendido'`.

## Puntuación y clasificación

- Confrontación ganada: **2 puntos**; empate (3-3): **1 punto**; perdida: **0 puntos**.
- Penalizaciones por WO avisado o sin avisar, por no comparecencia del equipo y por no enviar el
  acta a tiempo. Los puntos pueden quedar en negativo. → `fase_equipo.puntos` admite negativos.
- Desempates: enfrentamiento directo, después diferencia de sets, de juegos y otros averages.
- La clasificación oficial es la que publica la liga; la web la copia con el scraper y no la
  recalcula.

## Actas y plazos

- El equipo **local** envía el acta hasta el **martes a las 14:00**; fuera de plazo hay sanción.
  → `confrontacion.acta_enviada` (aviso pendiente de construir).
- La liga valida los resultados hasta el **miércoles a las 14:00**. → el scraper se ejecuta
  después, los miércoles por la tarde.

## Partidos en casa

- Sede fija del equipo, **sábado o domingo entre las 10:00 y las 18:00**, con un mínimo de
  **2 pistas**.

## Fases de la temporada 2026-27

| Fase                     | Cuándo                            | Formato                                                     |
| ------------------------ | --------------------------------- | ----------------------------------------------------------- |
| Apertura                 | Desde el 10-11 de octubre de 2026 | Liga a una vuelta en el grupo                               |
| Retos                    | 7-8 de noviembre                  | Eliminatorias de ascenso y descenso                         |
| Clausura                 | Desde el 14-15 de noviembre       | Segunda vuelta; **todos empiezan de 0**                     |
| Fase previa de play-off  | Tras la clausura                  | Ranking global en categorías de 8 equipos (1.º contra 8.º…) |
| Play-off final y Masters | Hasta el 23-24 de enero de 2027   | Masters Zonal y de la Comunidad, en Oro, Plata y Bronce     |

- El calendario incluye jornadas reservadas para partidos aplazados.
- Tras los retos un equipo puede cambiar de división, y por tanto de grupo y de URL.
  → cada `fase` guarda su `url_grupo`.
- En las **eliminatorias** a partido único, si hay **empate total el mixto vale doble**.
- En **Masters Oro** la alineación va obligatoriamente por **puntos FMP** y cada jugador
  necesita al menos **2 participaciones** previas. La normativa dice que los puntos se toman a
  fecha del «6 de enero de 2026», casi seguro una errata por 2027: confirmarlo si se llega.
