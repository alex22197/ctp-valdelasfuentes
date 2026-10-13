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
  anima si el móvil tiene activado «reducir movimiento».
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
  a nuestro equipo. Debajo, la fecha y la sede.
- **Convocatoria**: las 6 parejas, cada una sobre su media pista (revés a la izquierda, drive a
  la derecha). El mixto en verde lima. Si no hay alineación: «Todavía no está publicada…».
- **Clasificación** del grupo, con nuestra fila resaltada.
- **Calendario** de la fase: «J1», rival, fecha y una etiqueta «Fuera» o «En casa».

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
- Botones «Copiar para WhatsApp» (genera el texto de la convocatoria con el mismo formato que
  usa el capitán) y «Editar alineación».
- Sin respuestas a la encuesta: la web ya no la registra
  ([ADR 0012](decisiones/0012-sin-encuesta-en-la-web.md)). «Pasar lista» se retiró.

**Plantilla** (construida; pública, en el menú)

- Chicos, chicas y comodines, por orden alfabético, en dos columnas en el móvil.
- Cada jugador es una ficha con sus iniciales en un círculo verde, el nombre y «3 partidos, 67 %
  ganados» (o «Sin partidos»). Al tocarla lleva a su ficha.
- Los comodines salen aparte, con «No tienen ficha pública», y sin enlace salvo para los
  gestores.

**Ficha de jugador** (construida; pública, en `/jugadores/:id`)

- Nombre en grande y una frase con los partidos en los que juega y su lado habitual: el
  preferido de la plantilla o, si no hay, el lado en el que más ha jugado.
- Marcador sobre la pista con partidos, ganados y sets (por ejemplo «6–5»); los números entran
  con un pequeño rebote.
- Si ha jugado: anillo de ECharts con ganados (verde oscuro) y perdidos (naranja) y el % en el
  centro, y dos barras con sets y juegos ganados contra perdidos, repartidas en proporción y
  con su número.
- Por lado: media pista partida en revés y drive con partidos y victorias en cada uno.
- Con quién juega: compañeros con barra de porcentaje de victorias (verde oscuro sobre naranja,
  que crece al aparecer) y enlace a su ficha.
- Por número de pareja («Masculino 1», «Mixto»), con la misma barra.
- Su temporada: una fila por jornada con G (círculo verde relleno), P (borde naranja) o vacío
  discontinuo (no jugó), rival, detalle («Masculino 1 con Sergio, de revés») y sets. Encima, una
  gráfica con los juegos ganados menos los perdidos de cada jornada (hacia arriba si ganó, hacia
  abajo si perdió); las jornadas que no jugó quedan vacías y los WO llevan «WO».
- Se llega desde la plantilla y desde los nombres de la convocatoria de la portada. Los comodines no tienen ficha
  pública ni enlace; los gestores sí la ven, con el aviso «Es comodín».

**Estadísticas** (construida; pública, en el menú)

- Filtro en píldoras: «Toda la liga» y cada fase de la competición.
- **Evolución de la temporada**: barras claras con los partidos ganados en cada jornada y una
  línea por fase con los puntos acumulados (sin sanciones; vuelven a cero en cada fase y una
  jornada con partidos pendientes queda como hueco). Al tocar una jornada se ven sus seis
  pistas debajo; al entrar, la última.
- **Jornada a jornada**: 6 casillas por jornada según el formato (M1-M3, F1-F2, mixto). Ganado:
  verde oscuro relleno; perdido: borde naranja; pendiente o suspendido: borde discontinuo. Los
  WO llevan escrito «WO». Debajo, el marcador y los puntos («puntos pendientes» si falta algún
  partido).
- **Por partido**: barras de ECharts con el porcentaje de victorias en M1, M2, M3, F1, F2 y
  mixto (este en lima). Los WO cuentan, porque suman o restan al equipo.
- **Quién con quién**: matriz de ECharts por chicos, chicas o mixto con el número de partidos
  juntos; el color, de claro a oscuro, indica el porcentaje de victorias, para que se entienda
  aunque no se distinga el color. En chicos y chicas cada pareja sale en las dos mitades, para
  que la fila de cada jugador muestre a todos sus compañeros; en el mixto, chicos en filas y
  chicas en columnas. Los comodines llevan un asterisco. Si no cabe, se desplaza ella sola.
- **Parejas más repetidas**: las 5 que más han jugado juntas, con la barra de victorias.
- **Ranking de jugadores**: barras horizontales de chicos o chicas, ordenadas por partidos, %
  de victorias o diferencia de juegos (en naranja si es negativa).
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
