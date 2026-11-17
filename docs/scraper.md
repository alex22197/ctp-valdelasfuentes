# Scraper de la web de la liga

La liga no tiene API: la clasificación oficial, el calendario del grupo y los resultados de los
demás equipos solo están en su web. El scraper (`scraper/`) los lee cada miércoles y los copia en
nuestra base de datos. **Solo datos de equipo**
([ADR 0011](decisiones/0011-de-la-liga-solo-datos-de-equipo.md)): nunca jugadores, parejas ni
resultados individuales.

## Qué hace

Para cada fase de nuestra base de datos que tenga `url_grupo` y esté en juego (ha empezado y no
lleva más de una semana acabada):

1. Descarga su página de la liga: una sola petición por fase y semana.
2. La lee. Hay dos clases de página:
   - **Grupo** (`apertura` y `clausura`): `area_grupo.php` y `area_grupo_clausura.php`. Una tabla
     por jornada («marcador, local, VS, visitante, marcador») y la clasificación.
   - **Eliminatoria** (`retos`, `previa_playoff`, `playoff`, `masters`): `area_fase_ver.php`. Una
     sola tabla con todos los cruces de la zona, de todas las divisiones; el scraper se queda solo
     con los nuestros.
3. Reconoce a los equipos aunque la liga los escriba a su manera («PADELGON “C”», «SOTO
   TORREJON»): compara sin acentos, mayúsculas ni comillas. A los conocidos les guarda en
   `equipo.nombre_web` el texto exacto de la liga; los que no existen (un grupo cambia entre
   fases) los crea con ese texto como nombre, que el administrador puede retocar.
4. Escribe:
   - `fase_equipo`: la clasificación entera, tal como la publica la liga.
   - `confrontacion`: crea las que faltan (sin jornada en las eliminatorias). A las de **otros
     equipos** les pone el resultado y el estado «jugada» cuando la liga lo publica; una
     confrontación a 0-0 está sin jugar. A las **nuestras** nunca les escribe el marcador: sale
     de lo que metemos nosotros ([ADR 0008](decisiones/0008-marcador-de-la-confrontacion-calculado.md));
     si la liga dice otra cosa, o ya tiene resultado y a nosotros nos faltan partidos, lo avisa.
   - Nunca toca la fecha, la hora, la sede ni las pistas de una jornada: las ponen los gestores.
5. Registra la ejecución en `ejecucion_scraper` (`ok` y un mensaje con lo que ha hecho y los
   avisos). Si una fase falla, no deja nada a medias de esa fase y sigue con las demás; la
   ejecución queda como fallida y GitHub avisa por correo.

Si la liga cambia el diseño de sus páginas, el scraper falla con un mensaje claro («la
clasificación tiene otras columnas», «ninguna jornada»…) en vez de guardar datos a medias.
Entonces hay que ajustar `scraper/src/pagina-grupo.ts` o `pagina-eliminatoria.ts` y sus copias de
prueba en `scraper/src/fixtures/`.

## Cuándo y cómo se ejecuta

- [`.github/workflows/semanal.yml`](../.github/workflows/semanal.yml), los miércoles a las 14:00
  UTC, después de la copia de seguridad (así hay una copia de justo antes). Secreto:
  `SUPABASE_SECRET_KEY`, la clave secreta del proyecto de Supabase (**Project Settings → API
  Keys → Secret keys**), que se salta RLS.
- A mano, desde **Actions → Semanal → Run workflow**. Con **simular** marcado, cuenta qué
  cambiaría sin escribir nada: para probar.
- En local, desde `scraper/`:

  ```bash
  npm ci
  npm run leer -- "https://ligamasterpadel.lansoft.es/php/area_grupo_clausura.php?id=4"  # solo muestra lo que entiende de una página
  SUPABASE_SECRET_KEY=… npm run simular                                                   # con la base de datos, sin escribir
  npm run verificar                                                                      # tipos, formato y tests
  ```

## Cuando empieza una fase

El scraper lee las fases que existen en nuestra base de datos; crearlas es cosa del
administrador. Para una fase nueva, una fila en `fase` con su `tipo`, `orden`, `inicio` y la
`url_grupo` de la liga:

| Fase (2026-27)          | Página de la liga                                                      |
| ----------------------- | ---------------------------------------------------------------------- |
| Apertura                | `https://ligamasterpadel.lansoft.es/php/area_grupo.php?id=4`           |
| Retos                   | `https://ligamasterpadel.lansoft.es/php/area_fase_ver.php?id=1&fase=2` |
| Clausura                | `https://ligamasterpadel.lansoft.es/php/area_grupo_clausura.php?id=4`  |
| Fase previa de play-off | Por confirmar cuando la liga la publique (`area_fase_ver.php?…`)       |

Tras los retos un equipo puede cambiar de división y de grupo, así que el `id` de la página
puede cambiar de una temporada a otra.

## Aviso legal de la liga

Revisado el 17 de noviembre de 2026. La web no tiene `robots.txt`. Su aviso legal es el texto
estándar sobre propiedad intelectual (reproducción con autorización). Lo que hacemos: una
petición por fase y semana, identificándonos en el `User-Agent`, para copiar la clasificación y
los resultados de nuestro propio grupo, que son datos públicos de la competición en la que
jugamos y que mostramos solo a nuestro equipo. No se copian textos, imágenes ni datos de
personas.
