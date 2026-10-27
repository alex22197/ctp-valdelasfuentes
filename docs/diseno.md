# Diseño

## Bocetos

Los bocetos aprobados están en un lienzo de Claude:
<https://claude.ai/artifact/KxsiGwjSb2K65SrSfu2CSp> (privado de Alex). Este documento los
describe para quien no pueda abrirlo. Los datos de los bocetos son de ejemplo, salvo
clasificación, calendario y nombres.

### Principios

- **Pensado para el móvil**: casi todo el equipo entrará desde WhatsApp. En escritorio el
  menú sube a la cabecera.
- **La pista de pádel es el elemento característico**: alineaciones, fichas de jugador y la bola
  amarilla salen de ella.
- **Animada con propósito** ([ADR 0010](decisiones/0010-animacion-con-proposito.md)): lo que
  cambia se mueve para explicar de dónde viene y adónde va, todo responde al tocar y nada se
  anima si el móvil tiene activado «reducir movimiento». La única animación que se repite es
  Libra persiguiendo una pelota de pádel (un guiño de Alex), en una ventana centrada delante
  del contenido cuando una petición tarda más de 0,4 s: dice que se está esperando una
  respuesta y se va en cuanto llega, tras dejarse ver al menos un segundo.
- Tiene que parecer hecho a mano para este equipo, no una plantilla. Evitar: tarjetas
  idénticas con sombra para todo, etiquetas en MAYÚSCULAS, textos unidos con puntos medios
  («A · B · C»), flechas «→» en botones, degradados decorativos.
- Textos claros en castellano y en voz activa. Los mensajes de vacío y de error dicen qué pasa
  y qué hacer.

### Pantallas

**Inicio** (construida)

- Cabecera con el escudo y «CTPA / Valdelasfuentes».
- Bloque del **próximo partido** sobre una pista verde con el borde dibujado: equipo local
  arriba, la **red** (línea blanca de lado a lado) y el visitante abajo. Una bola amarilla marca
  a nuestro equipo. Debajo, la fecha y la sede. Si la sede es un enlace de Google Maps, sale el
  nombre del sitio, su dirección y un botón blanco «Cómo llegar» que abre el mapa.
- **Convocatoria**: las 6 parejas, cada una sobre su media pista (revés a la izquierda, drive a
  la derecha). El mixto en verde lima. Si no hay alineación, las seis pistas vacías (solo sus
  líneas, en discontinuo) y «Todavía no está publicada…».
- **Clasificación** del grupo, una línea por equipo (nombre condensado), con nuestra fila
  resaltada y la bola amarilla tras el nombre.
- **Calendario** de la fase: «J1», rival, fecha y una etiqueta «Fuera» o «En casa».
- En escritorio, a dos columnas: el próximo partido junto a la convocatoria y, debajo, la
  clasificación junto al calendario.

**Reglamento** (construida; pública, en el menú)

- «Lo esencial en un minuto» sobre fondo de pista, con cada clave numerada en una bola
  amarilla.
- Índice de temas en píldoras y once secciones desplegables, cada una con su resumen «en corto»,
  ejemplos (recuadro verde) y avisos (borde naranja con «Ojo»). Cada sección tiene su enlace
  (`/reglamento#wo`) para compartirlo por WhatsApp, y se abre sola al llegar desde él.
- Glosario y enlace al PDF oficial arriba y abajo.

**Jornada y convocatoria, vista de capitán** (construida; solo gestores)

- Cada lado de la pista es una ficha con las iniciales y el nombre del jugador, o un hueco
  con «+». Al tocarla sube desde abajo un panel con los jugadores como fichas (la plantilla y,
  aparte, los comodines), con buscador y la pista en la que ya está cada uno. Al elegir, la ficha
  vuela del panel a su sitio en la pista.

- Rival en grande, fecha y sede.
- Alineación sobre las 6 mini pistas, con estado «Borrador» o «Publicada».
- Comprobación de normativa visible: «Cumple la normativa: las 6 parejas están completas y nadie
  del mixto repite».
- «Copiar para WhatsApp» copia una **imagen** con la tabla que usa el capitán: cabecera azul
  claro «vs SOTO TORREJÓN SÁBADO 12:00 LOS 6 A LA VEZ» (o «EN 3 PISTAS», con las parejas en el
  orden de juego) y una fila por pareja con su etiqueta de color (masculino naranja, femenino
  amarillo, mixto violeta), revés y drive. Usa el nombre completo si está en la plantilla.
- Solo se activa con todas las parejas completas y la alineación guardada; si no, dice por qué.
  La imagen se enseña debajo para revisarla, con «Compartir» (si el móvil lo permite) y
  «Descargar» por si no se puede copiar.
- Sin respuestas a la encuesta: la web ya no la registra
  ([ADR 0012](decisiones/0012-sin-encuesta-en-la-web.md)). «Pasar lista» se retiró.

**Plantilla** (construida; pública, en el menú)

- Chicos, chicas y comodines, por orden alfabético, en dos columnas en el móvil.
- Cada jugador es una ficha con sus iniciales en un círculo verde y el nombre; debajo, «3
  partidos» y «67 %» en una línea con una barra fina de victorias (o «Sin partidos»). Al tocarla
  lleva a su ficha.
- Los comodines salen aparte, con «No tienen ficha pública», y sin enlace salvo para los
  gestores.

**Ficha de jugador** (construida; pública, en `/jugadores/:id`)

- Nombre en grande y una frase con los partidos en los que juega y su lado habitual: el
  preferido de la plantilla o, si no hay, el lado en el que más ha jugado.
- Marcador sobre la pista con partidos, ganados y sets (por ejemplo «6–5»); los números entran
  con un pequeño rebote.
- Si ha jugado: anillo de ECharts con ganados (verde oscuro) y perdidos (rojo) y el % en el
  centro, y dos barras con sets y juegos ganados contra perdidos, repartidas en proporción y
  con su número.
- Por lado: media pista partida en revés y drive con partidos y victorias en cada uno.
- Debajo del marcador, la racha actual a partir de dos partidos seguidos iguales: «En racha: 3
  victorias seguidas» en verde o «Mala racha: 2 derrotas seguidas» en rojo.
- Con quién juega: compañeros con barra de porcentaje de victorias (verde oscuro sobre rojo,
  que crece al aparecer) y enlace a su ficha.
- Por número de pareja («Masculino 1», «Mixto»), con la misma barra y un cuadradito del color
  de su pista (lima en el mixto).
- Su temporada: una fila por jornada con G (círculo verde relleno), P (borde rojo) o vacío
  discontinuo (no jugó), rival, detalle («Masculino 1 con Sergio, de revés») y sets. Encima, una
  gráfica con los juegos ganados menos los perdidos de cada jornada (hacia arriba si ganó, hacia
  abajo si perdió); las jornadas que no jugó quedan vacías y los WO llevan «WO».
- Se llega desde la plantilla y desde los nombres de la convocatoria de la portada. Los comodines no tienen ficha
  pública ni enlace; los gestores sí la ven, con el aviso «Es comodín».

**Estadísticas** (construida; pública, en el menú)

- Filtro en píldoras: «Toda la liga» y cada fase de la competición.
- **Evolución de la temporada**: barras claras con los partidos ganados en cada jornada y una
  línea por fase con los puntos acumulados (sin sanciones; vuelven a cero en cada fase y una
  jornada con partidos pendientes queda como hueco). Al tocar una jornada sale su ficha
  abierta debajo; al entrar, la última.
- **Jornada a jornada**: una ficha por jornada (`ctp-ficha-jornada`), cerrada. Arriba, número,
  rival, marcador y puntos («puntos pendientes» si falta algún partido); debajo, una tira con un
  recuadro por partido agrupado en Masculino, Femenino y Mixto. Al abrirla, cada partido con
  «Pareja 1…», quién jugó y los sets, o «WO», «Abandono», «Suspendido» o «Por jugar». Ganado:
  verde oscuro relleno y ✓; perdido: borde rojo y ✕; por jugar: borde discontinuo y –
  (mixin `resultado.marca` de `_resultado-partido.scss`). Sin códigos tipo M1: no se
  entienden.
- **Nosotros contra el grupo**: barras de ECharts que salen del centro, a la derecha los partidos
  a favor (verde oscuro) y a la izquierda los en contra (rojo) de cada equipo del grupo, de
  mejor a peor diferencia, el nuestro en negrita. Salen de `fase_equipo` sumando las fases
  elegidas.
- **Mapa de forma**: cuadrícula de ECharts jugador × jornada, chicos o chicas: ✓ verde oscuro si
  ganó, ✕ rojo si perdió, «WO» verde si ganó sin jugar y gris claro si no jugó. Los que más
  ganan arriba. Tocar una casilla o un nombre resalta al jugador.
- **Casa y fuera** y **Partidos ajustados**: barras de ganados y perdidos (`opcionesBalance`,
  compartida con la ficha del jugador): en casa y fuera, por categoría, y en dos sets, a tres
  sets y tie-breaks. Salen de la vista `estadistica_partido_equipo`.
- **Por partido**: barras horizontales de ECharts con el porcentaje de victorias de cada pareja
  («Pareja 1 masculina»…, la mixta en lima). Los WO cuentan, porque suman o restan al equipo.
- En lo público, las parejas se nombran con `nombrePareja` («Pareja 2 femenina», «Pareja
  mixta»), nunca con códigos tipo M1 o F2, que solo entiende quien gestiona.
- **Química de parejas**: para cada pareja con dos o más partidos juntos, su porcentaje de
  victorias frente a la media del de sus dos jugadores; una barra que sale del centro, verde a
  la derecha si suma y roja a la izquierda si resta, con la cifra (`+25`).
- **Quién con quién**: matriz de ECharts por chicos, chicas o mixto con el número de partidos
  juntos; el color, de claro a oscuro, indica el porcentaje de victorias, para que se entienda
  aunque no se distinga el color. En chicos y chicas cada pareja sale en las dos mitades, para
  que la fila de cada jugador muestre a todos sus compañeros; en el mixto, chicos en filas y
  chicas en columnas. Los comodines llevan un asterisco. Si no cabe, se desplaza ella sola.
- **Parejas más repetidas**: las 5 que más han jugado juntas, con la barra de victorias.
- **Ranking de jugadores**: barras horizontales de chicos o chicas, ordenadas por partidos, %
  de victorias o diferencia de juegos (en rojo si es negativa). La tabla añade la racha actual de cada jugador
  («3 victorias seguidas»), sin los WO.
- **Revés contra drive**: barras en mariposa, revés a la izquierda y drive a la derecha, con el %
  de victorias de cada lado al tocar.
- **Jugador resaltado**: tocar a un jugador en el ranking, la mariposa o la matriz (una casilla
  resalta al jugador de su fila; un nombre, a ese jugador) lo resalta en todas: lo demás se
  atenúa, también en parejas más repetidas. Abajo aparece «Resaltando a Sergio.» con «Ver su
  ficha» y un botón para quitarlo; tocar al mismo jugador otra vez también lo quita. Así se
  combinan las gráficas enlazadas con ir a la ficha sin salir de la página al primer toque.
  Los comodines se pueden resaltar, pero solo los gestores ven su ficha.
- En las tablas de datos, cada nombre lleva a su ficha: un camino sin canvas para teclado y
  lectores de pantalla.
- **Respuestas y participación** (solo gestores, con candado): barras apiladas por jugador con
  jugó / podía sin convocar / no podía / sin responder.
- Cada gráfica tiene descripción para lectores de pantalla y «Ver los datos en una tabla». La
  ayuda sale al tocar, los colores salen de los tokens y no se anima con «reducir movimiento».
- La barra inferior del móvil tiene cinco secciones: sus etiquetas usan la letra condensada
  para caber en 320 px.

## Sistema visual

Definido en [`web/src/styles/_tokens.scss`](../web/src/styles/_tokens.scss).

| Uso                           | Color                                                                     |
| ----------------------------- | ------------------------------------------------------------------------- |
| Principal: césped de la pista | `#1F7A30` (oscurecido respecto al escudo para que el texto blanco se lea) |
| Mixto: lima del escudo        | `#A8C61E`, con texto oscuro                                               |
| Nuestro equipo: bola          | `#F2E330`                                                                 |
| Derrotas                      | `#D9662B` (texto `#B4501C`)                                               |
| Fondo / texto                 | `#F4F6F2` / `#14211A`                                                     |

- **Tipografía**: Archivo de Google Fonts, aprovechando su eje de anchura. Condensada
  (`font-stretch: 66%`) y muy gruesa para nombres, marcadores y títulos, como un marcador
  deportivo; normal para el texto.
- **Ganado/perdido** se distingue también por claridad (oscuro/claro), no solo por el color.
- **Escudo**: `web/public/imagenes/escudo-ctp-alcobendas.png`, recortado con fondo transparente
  a partir del original del club (que tenía fondo blanco). Si el club tiene una versión
  vectorial, sustituirla.
