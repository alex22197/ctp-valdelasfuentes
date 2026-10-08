# Base de datos

PostgreSQL gestionado por Supabase (región West EU, Irlanda). El esquema está definido
íntegramente en [`supabase/migrations/`](../supabase/migrations/).

## Tablas

| Tabla               | Qué guarda                                                                        | Pública        |
| ------------------- | --------------------------------------------------------------------------------- | -------------- |
| `competicion`       | Una liga en una temporada y su formato (partidos de cada tipo).                   | Sí             |
| `fase`              | Apertura, retos, clausura, play-off… con la URL de su grupo en la web de la liga. | Sí             |
| `equipo`            | Equipos del grupo. `nombre_web` es el texto exacto de la liga, para el scraper.   | Sí             |
| `fase_equipo`       | Clasificación oficial de cada grupo.                                              | Sí             |
| `jugador`           | Nombre para mostrar, sexo y lado preferido.                                       | Sí             |
| `jugador_privado`   | Nombre completo.                                                                  | **No**         |
| `plantilla`         | Quién está inscrito en cada competición y si es comodín.                          | Sí             |
| `confrontacion`     | Cada jornada entre dos equipos: fecha, sede, estado y resultado global.           | Sí             |
| `disponibilidad`    | Respuestas a la encuesta de WhatsApp y quién fue convocado.                       | **No**         |
| `partido`           | Los 6 partidos de cada confrontación de nuestro equipo.                           | Sí             |
| `set_partido`       | Marcador de cada set, con el tie-break si lo hubo.                                | Sí             |
| `participacion`     | Quién jugó cada partido y en qué lado.                                            | Sí             |
| `perfil`            | Rol (admin o capitán) de cada usuario con permisos.                               | Solo el propio |
| `ejecucion_scraper` | Registro de cada ejecución del scraper.                                           | **No**         |

Vista `partido_resultado`: sets, juegos y si se ganó cada partido, calculado a partir de
`set_partido` y del tipo de resultado (los WO no tienen sets).

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
- `ganado` en un partido que no es un abandono (en el resto se calcula; ver la vista).
- Borrar a un jugador que ya ha jugado algún partido.

## Seguridad

- RLS activado en todas las tablas.
- **Visitantes** (`anon`): solo lectura de las tablas públicas.
- **Gestores** (usuarios con fila en `perfil`): lectura y escritura de todo.
- **Admin**: además gestiona la tabla `perfil` (quién es gestor).
- El proyecto **no expone tablas automáticamente**: cada migración concede con `grant`
  exactamente lo que hace falta.
- El scraper usará la clave secreta (`service_role`), que se salta RLS y solo vive en los
  secretos de GitHub.

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

| Migración                            | Contenido                                                                                       |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `20261008120000_esquema_inicial.sql` | Tablas, validaciones, vista de resultados, RLS y permisos.                                      |
| `20261008120100_datos_iniciales.sql` | Competición, grupo, equipos, plantilla, calendario de la apertura y alineación de la jornada 1. |

## Pendiente

- Convertir las comprobaciones manuales de la normativa en tests automáticos de base de datos
  (pgTAP con `supabase test db`).
- Vistas de estadísticas (por jugador, por pareja, por posición).
- Copia de seguridad semanal con `pg_dump` desde GitHub Actions.
