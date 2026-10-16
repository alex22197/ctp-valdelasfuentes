# Base de datos

PostgreSQL gestionado por Supabase (región West EU, Irlanda). El esquema está definido
íntegramente en [`supabase/migrations/`](../supabase/migrations/).

## Tablas

| Tabla               | Qué guarda                                                                                                 | Pública        |
| ------------------- | ---------------------------------------------------------------------------------------------------------- | -------------- |
| `competicion`       | Una liga en una temporada y su formato (partidos de cada tipo).                                            | Sí             |
| `fase`              | Apertura, retos, clausura, play-off… con la URL de su grupo en la web de la liga.                          | Sí             |
| `equipo`            | Equipos del grupo. `nombre_web` es el texto exacto de la liga, para el scraper.                            | Sí             |
| `fase_equipo`       | Clasificación oficial de cada grupo.                                                                       | Sí             |
| `jugador`           | Nombre para mostrar, sexo y lado preferido.                                                                | Sí             |
| `jugador_privado`   | Nombre completo.                                                                                           | **No**         |
| `plantilla`         | Quién está inscrito en cada competición y si es comodín.                                                   | Sí             |
| `confrontacion`     | Cada jornada entre dos equipos: fecha, sede, estado, resultado global y si su convocatoria está publicada. | Sí             |
| `disponibilidad`    | Quién fue convocado. La columna `respuesta` (encuesta) ya no se usa: ADR 0012.                             | **No**         |
| `partido`           | Los 6 partidos de cada confrontación de nuestro equipo.                                                    | Sí             |
| `set_partido`       | Marcador de cada set, con el tie-break si lo hubo.                                                         | Sí             |
| `participacion`     | Quién jugó cada partido y en qué lado.                                                                     | Sí             |
| `perfil`            | Rol (admin o capitán) de cada usuario con permisos. Siempre queda al menos un admin (trigger).             | Solo el propio |
| `invitacion_gestor` | Correos de Google invitados a gestionar que aún no han entrado; se borra al entrar. Solo por funciones.    | **No**         |
| `ejecucion_scraper` | Registro de cada ejecución del scraper.                                                                    | **No**         |

Vistas:

- `partido_resultado`: sets, juegos y si se ganó cada partido, calculado a partir de
  `set_partido` y del tipo de resultado (los WO no tienen sets).
- `confrontacion_marcador`: partidos ganados, perdidos y pendientes de cada confrontación
  nuestra, calculados a partir de `partido_resultado`
  ([ADR 0008](decisiones/0008-marcador-de-la-confrontacion-calculado.md)).

Vistas de estadísticas (#13). Todos los cálculos se hacen aquí; la web solo los lee:

| Vista                         | Una fila por                                         | Quién la ve |
| ----------------------------- | ---------------------------------------------------- | ----------- |
| `estadistica_partido_jugador` | Partido decidido de un jugador (base del resto)      | Todos       |
| `estadistica_jugador`         | Jugador: partidos, sets, juegos, %, WO a favor       | Todos       |
| `estadistica_jugador_lado`    | Jugador y lado (drive o revés)                       | Todos       |
| `estadistica_jugador_puesto`  | Jugador y puesto (Masculino 1, Femenino 2…)          | Todos       |
| `estadistica_pareja`          | Pareja (`jugador_a_id` < `jugador_b_id`)             | Todos       |
| `estadistica_puesto`          | Puesto del equipo, con WO a favor y en contra        | Todos       |
| `estadistica_jornada`         | Confrontación nuestra jugada, con marcador y puntos  | Todos       |
| `estadistica_participacion`   | Jugador: jornadas jugadas y por qué no jugó el resto | Gestores    |

- Las agrupadas tienen una fila por fase y otra de toda la competición
  (`toda_la_competicion` = true, `fase_id` nulo). Nunca mezclan competiciones.
- Las individuales no cuentan los WO
  ([ADR 0006](decisiones/0006-wo-fuera-de-estadisticas-individuales.md)); los WO a favor salen
  aparte en `estadistica_jugador`. Un WO en contra no tiene jugadores. Las del equipo sí cuentan
  los WO.
- Quedan fuera los partidos suspendidos y los que están por jugar. De un abandono cuentan
  todos los juegos, pero solo los sets terminados.
- Porcentaje: `round(100 * ganados / partidos)`, entero; nulo sin partidos.
- `estadistica_partido_jugador.marcador`: juegos de cada set desde nuestro lado («6-3 4-6»),
  con el set a medias de un abandono; nulo en los WO. `estadistica_jornada` lleva
  `fase_nombre` y `fase_orden`, porque el número de jornada se repite en cada fase.
- En la ficha, una jornada con el partido suspendido o en WO en contra sale como «no jugó».
- Los comodines llevan `comodin` = true (en parejas, uno por jugador): la web los separa.
- `estadistica_jornada.puntos` (2, 1 o 0) solo aparece sin partidos pendientes y no incluye
  sanciones: la clasificación oficial es `fase_equipo`.
- `estadistica_participacion` (sin uso en la web desde el ADR 0012) usa la encuesta: los visitantes no pueden leerla y a quien no es
  gestor le sale vacía. Cada jornada cuenta en una sola categoría: jugada (estaba en la
  alineación, aunque fuera WO a favor o se suspendiera), disponible sin jugar, no disponible o
  sin responder. Sin comodines.

## Funciones que llama la web

| Función                      | Qué hace                                                                                                                                                                                                                                            | Quién                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `guardar_resultado_partido`  | Guarda el resultado y los sets de un partido en una sola transacción. Crea el partido si no existe, quita la pareja en un WO en contra y marca la confrontación como `jugada` cuando todos sus partidos tienen ganador.                             | Gestores              |
| `guardar_respuesta_encuesta` | Sin uso desde el ADR 0012. Guarda lo que un jugador respondió a la encuesta de una jornada (Sí o No) sin tocar si está convocado. Volver a «sin responder» borra la fila, salvo que el jugador ya esté convocado: entonces solo vacía la respuesta. | Gestores              |
| `guardar_alineacion`         | Guarda todas las parejas de una confrontación en una sola transacción: crea los partidos que falten, sustituye las participaciones y marca como convocados a los colocados ([ADR 0009](decisiones/0009-convocados-son-los-de-la-alineacion.md)).    | Gestores              |
| `publicar_convocatoria`      | Publica la convocatoria para que se vea en la portada, o la devuelve a borrador.                                                                                                                                                                    | Gestores              |
| `listar_gestores`            | Gestores con su correo, nombre y papel, y las invitaciones pendientes.                                                                                                                                                                              | Admin                 |
| `dar_permiso_gestor`         | Da o cambia el papel a un correo. Si esa cuenta de Google ya existe (correo confirmado e identidad de Google), al momento; si no, queda invitada. Nadie cambia su propio permiso.                                                                   | Admin                 |
| `quitar_permiso_gestor`      | Quita el permiso o la invitación de un correo. Nadie se quita a sí mismo.                                                                                                                                                                           | Admin                 |
| `reclamar_permiso_gestor`    | La llama la web al entrar alguien sin papel: si su cuenta de Google confirmada tenía invitación, la convierte en su perfil. No va en un trigger de `auth.users` para que un fallo nunca impida entrar.                                              | Cualquiera con sesión |

La comprueba `validar_marcador`, que aplica las reglas de los sets de la normativa. La web
repite esas reglas en `data-access/resultados/validar-marcador.ts` para mostrar el error junto
al set sin esperar al servidor; si cambian, se cambian en los dos sitios.

## Reglas de la normativa en la base de datos

La base de datos rechaza, con un mensaje en castellano:

- Un partido de un tipo o número que no existe en el formato de la competición.
- Partidos, sets o disponibilidad en una confrontación en la que no juega nuestro equipo.
- Más de dos jugadores por partido o dos en el mismo lado.
- Un jugador en dos partidos de la misma confrontación (incluye el mixto).
- Un chico en un partido femenino, una chica en uno masculino o un mixto con dos del mismo sexo.
- Jugadores que no están en la plantilla de la competición.
- Sets en un partido con WO, o jugadores en un WO en contra.
- Juegos fuera de 0–7 o un tie-break en un set que no es 7-6.
- Un set imposible en el pádel aunque no se use la web: a 7 juegos solo se llega con 7-5 o 7-6
  (`set_posible`), y el tie-break se gana a 7 con 2 de diferencia por la pareja que gana el set
  (`tiebreak_posible`). Un set a medias (3-2, 6-6) sigue valiendo para abandonos y suspendidos.
- `ganado` en un partido que no es un abandono (en el resto se calcula; ver la vista).
- Al guardar con `guardar_resultado_partido`: sets que no terminan (6-5) en un partido
  jugado, marcadores imposibles (7-3), tie-breaks fuera de un 7-6 o mal ganados, sets de más
  o de menos, y abandonos sin indicar quién ganó.
- Borrar a un jugador que ya ha jugado algún partido.

## Seguridad

- RLS activado en todas las tablas.
- **Visitantes** (`anon`): solo lectura de las tablas públicas.
- **Gestores** (capitán y admin, usuarios con fila en `perfil`): leen todo; crean y cambian
  jornadas, partidos, sets, alineaciones, jugadores y plantilla.
- **Solo el admin**: la estructura de la temporada (`competicion`, `fase`, `equipo`,
  `fase_equipo`), borrar jornadas o jugadores (se llevan en cascada partidos y resultados) y
  la tabla `perfil` (quién es gestor). Siempre queda al menos un admin.
- **Alineaciones en borrador**: `participacion` solo la ven los gestores mientras la
  convocatoria no está publicada y el partido no tiene resultado.
- Los nombres de jugadores y equipos no admiten `<` ni `>`.
- El proyecto **no expone tablas automáticamente**: cada migración concede con `grant`
  exactamente lo que hace falta.
- El scraper usará la clave secreta (`service_role`), que se salta RLS y solo vive en los
  secretos de GitHub. No debe pisar `fecha_hora`, `sede` ni `num_pistas` de una jornada si ya
  los ha puesto un gestor desde la web: solo los rellena cuando están vacíos.

## Cómo cambiar el esquema

```bash
npm run db:nueva-migracion -- anadir_fotos_jugador   # crea supabase/migrations/<fecha>_anadir_fotos_jugador.sql
# … escribir el SQL …
npm run db:migrar                                    # aplica en Supabase
npm run db:tipos                                     # regenera los tipos de TypeScript
```

Reglas:

- Nunca editar una migración ya aplicada: se crea otra que corrija.
- Nunca cambiar el esquema desde el panel de Supabase; todo pasa por migraciones.
- Toda tabla nueva lleva RLS, políticas y `grant` en la misma migración.
- Si una regla de la normativa afecta a los datos, se aplica en la base de datos.

## Migraciones existentes

| Migración                                            | Contenido                                                                                                                                |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `20261008120000_esquema_inicial.sql`                 | Tablas, validaciones, vista de resultados, RLS y permisos.                                                                               |
| `20261008120100_datos_iniciales.sql`                 | Competición, grupo, equipos, plantilla, calendario de la apertura y alineación de la jornada 1.                                          |
| `20261008130000_resultados_confrontacion.sql`        | Vista `confrontacion_marcador` y funciones `validar_marcador` y `guardar_resultado_partido`.                                             |
| `20261008211955_guardar_respuesta_encuesta.sql`      | Función `guardar_respuesta_encuesta` para pasar lista.                                                                                   |
| `20261009114304_convocatoria_y_alineacion.sql`       | Columna `confrontacion.convocatoria_publicada` (la jornada 1 nace publicada) y funciones `guardar_alineacion` y `publicar_convocatoria`. |
| `20261011133401_vistas_de_estadisticas.sql`          | Vistas `estadistica_*` de jugadores, parejas, puestos, jornadas y participación.                                                         |
| `20261011134423_marcador_y_fase_en_estadisticas.sql` | Columnas `marcador` en `estadistica_partido_jugador` y `fase_nombre` y `fase_orden` en `estadistica_jornada`.                            |
| `20261011171259_set_posible_en_padel.sql`            | Restricciones `set_posible` y `tiebreak_posible` en `set_partido`.                                                                       |
| `20261016104056_permisos_de_gestores.sql`            | Tabla `invitacion_gestor`, funciones de permisos de gestor y trigger que deja siempre un administrador.                                  |
| `20261016115007_endurecer_permisos.sql`              | Invitaciones ligadas al correo verificado de Google, estructura solo para el admin, borradores ocultos y nombres sin `<` ni `>`.         |
| `20261016125521_reclamar_permiso_sin_carreras.sql`   | `reclamar_permiso_gestor` vuelve a leer el perfil si otra llamada a la vez ya reclamó la invitación.                                     |

## Pendiente

- Convertir las comprobaciones manuales de la normativa en tests automáticos de base de datos
  (pgTAP con `supabase test db`).
- Copia de seguridad semanal con `pg_dump` desde GitHub Actions.
