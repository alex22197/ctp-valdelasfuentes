# Normativa de la Liga MasterPadel (resumen)

Resumen de las reglas que afectan a la web, sacado de la
[normativa oficial](https://ligamasterpadel.lansoft.es/pdf/normativa.pdf) de la temporada
2026-27 (revisado entero el 11 de octubre de 2026). **Ante cualquier duda manda el PDF**, que la
liga puede actualizar. Junto a cada regla se indica dónde se aplica en el proyecto.

La versión para el equipo, explicada con ejemplos, está en la página pública `/reglamento`
(`web/src/app/features/reglamento/`). Si cambia una regla, se actualizan las dos.

## Plantilla

- Entre **16 y 40 jugadores** por equipo: mínimo **10 hombres y 6 mujeres**, máximo
  **24 hombres y 16 mujeres** (a partir del hombre 25 y la mujer 17 no cuentan). Edad mínima:
  **13 años**.
- Dos **actualizaciones** de la plantilla de hasta **8 jugadores** cada una hasta el final de
  la primera vuelta; las pide el capitán por correo. Un alta pedida antes del **miércoles a las
  14:00** puede jugar la jornada siguiente. La segunda, como tarde el viernes anterior a la
  jornada de aplazados de la primera vuelta.
- Solo pueden jugar jugadores **inscritos** en el equipo. Nadie puede estar en dos equipos ni
  cambiar de equipo una vez empezada la liga (salvo fuerza mayor).
  → `plantilla.inscrito_oficial` y aviso al convocar comodines.
- **DNI**: los capitanes pueden pedirse la identificación de los jugadores (DNI, carnet de
  conducir o pasaporte) al empezar; quien no la presenta pierde su partido.
- Equipos filiales: un jugador solo puede subir al equipo inmediatamente superior y nunca jugar
  dos confrontaciones en la misma jornada. _(No aplica: el club tiene un solo equipo.)_

## Confrontación

- Cada jornada entre dos equipos tiene **6 partidos**: masculino 1, 2 y 3; femenino 1 y 2;
  mixto. → `competicion.formato` y trigger `validar_partido`.
- Quien juega el **mixto no puede jugar otro partido** en esa confrontación; en general, nadie
  juega dos partidos. → trigger `validar_participacion`.
- La alineación es libre (se recomienda ordenar las parejas por nivel), se entrega **por
  escrito antes de empezar** y **no se puede cambiar**.
- Si hay menos de 6 pistas, el orden de juego es **F1, M1, Mixto, F2, M2, M3**, salvo acuerdo
  de los capitanes. Entre turnos, como mínimo **1 hora desde el comienzo del partido anterior**,
  y no se puede dar WO hasta pasados **75 minutos** desde ese comienzo.
  → `confrontacion.num_pistas`.
- Partidos al **mejor de 3 sets**, con **tie-break en todos los sets** y **punto de oro**. Lo
  no escrito, por el reglamento de la Federación Española de Pádel.
  → `set_partido` (juegos de 0 a 7, tie-break solo en 7-6).
- El **capitán local** hace de juez-árbitro en la jornada; el comité de competición resuelve
  los conflictos.

## WO y no comparecencia

- Un WO de pareja hay que avisarlo por **correo y teléfono al capitán rival con 24 horas** y
  por correo a la organización el día antes (con copia al rival). Avisado, solo se pierde ese
  partido.
- Sin avisar: el **primer WO resta 2 puntos** «sobre el resultado final» y el **segundo, 1 más**
  (3 en total). La normativa no aclara si se restan de la jornada o de la clasificación.
- Presentarse con **3 parejas o menos** es WO: se pierde la confrontación **6-0**.
- No comparecencia del equipo: **−1 punto** en la clasificación general la primera vez, **−2**
  la segunda y **exclusión** la tercera.
- Las parejas «corren hacia arriba»: el WO siempre recae en la **última pareja** de ese tipo.
  → `partido.resultado = 'wo_favor' | 'wo_contra'`.

## Puntuación y clasificación

- Confrontación ganada: **2 puntos**; empate (3-3): **1 punto**; perdida: **0 puntos**.
- Se restan las sanciones por WO y por no enviar el acta a tiempo, así que los puntos pueden
  quedar en negativo. → `fase_equipo.puntos` admite negativos.
- Desempate entre dos: enfrentamiento directo (diferencia de sets y después de juegos), average
  particular de partidos y después average total de la liga regular (partidos, sets…). Entre
  tres: average total de partidos, después de sets y de juegos.
- La clasificación oficial es la que publica la liga; la web la copia con el scraper y no la
  recalcula.

## Lluvia, aplazamientos y suspensiones

- Por mal tiempo solo se aplaza **90 minutos antes** del comienzo (salvo acuerdo de los
  capitanes). Lo aplazado se juega en los periodos de recuperación del calendario.
- Si no se llega a jugar: **0 puntos para los dos**, salvo que uno demuestre por correo que
  intentó jugar. Si se aplazó por otra causa que no sea el tiempo, quien la aplazó **pierde
  6-0**. → `confrontacion.estado = 'aplazada'`.
- Los partidos **suspendidos** se reanudan con el **mismo marcador, parejas y rivales**; las
  parejas que no habían empezado sí pueden cambiar. → `partido.resultado = 'suspendido'`.

## Actas y plazos

- El equipo **local** rellena el acta (parejas con nombre y apellidos, resultados, firmas e
  incidencias firmadas por los dos capitanes) y la envía en la web de la liga hasta el
  **martes a las 14:00**; fuera de plazo, **−1 punto** en la clasificación general.
  → `confrontacion.acta_enviada` (aviso pendiente de construir).
- El visitante la valida hasta el **miércoles a las 14:00**; si no, se valida sola.
  → el scraper se ejecuta después, los miércoles por la tarde.
- Reclamaciones por errores en los resultados publicados: **3 días naturales**.

## Partidos en casa

- Sede fija, **sábado o domingo**, empezando **entre las 10:00 y las 18:00**, con un mínimo de
  **2 pistas** que empiezan a la misma hora. Cambiar de sede: avisar con **una semana**.
- Bola oficial **Wilson Premier Padel**; el local pone al menos **tres botes nuevos**. La
  normativa sanciona con WO al local que no cumple las normas de bolas y sede.

## Fases de la temporada 2026-27

| Fase                     | Cuándo                            | Formato                                                     |
| ------------------------ | --------------------------------- | ----------------------------------------------------------- |
| Apertura                 | Desde el 10-11 de octubre de 2026 | Liga a una vuelta en el grupo                               |
| Retos                    | 7-8 de noviembre                  | Eliminatorias de ascenso y descenso                         |
| Clausura                 | Desde el 14-15 de noviembre       | Segunda vuelta; **todos empiezan de 0**                     |
| Fase previa de play-off  | 12-13 de diciembre                | Ranking global en categorías de 8 equipos (1.º contra 8.º…) |
| Play-off final y Masters | Hasta el 23-24 de enero de 2027   | Masters Zonal y de la Comunidad, en Oro, Plata y Bronce     |

- Recuperación de aplazados: 31 de octubre-1 de noviembre, 5-6 de diciembre y 19-20 de
  diciembre de 2026. El calendario es **orientativo**.
- Tras los retos un equipo puede cambiar de división, y por tanto de grupo y de URL.
  → cada `fase` guarda su `url_grupo`.
- En los **retos, la fase previa de play-off y el play-off final**, si una eliminatoria de
  ascenso o descenso acaba empatada en todo (puntos, sets y juegos), **el mixto vale doble**.
- En **Masters Oro** la alineación va obligatoriamente por **puntos FMP** y cada jugador
  necesita al menos **2 participaciones** previas. La normativa dice que los puntos se toman a
  fecha del «6 de enero de 2026», casi seguro una errata por 2027: confirmarlo si se llega.
