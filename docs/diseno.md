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
  con «+». Al tocarla sube desde abajo un panel con los jugadores como fichas, agrupados por
  lo que respondieron, con buscador y la pista en la que ya está cada uno. Al elegir, la ficha
  vuela del panel a su sitio en la pista.

- Rival en grande, fecha y sede.
- Alineación sobre las 6 mini pistas, con estado «Borrador» o «Publicada».
- Comprobación de normativa visible: «Cumple la normativa: las 6 parejas están completas y nadie
  del mixto repite».
- Botones «Copiar para WhatsApp» (genera el texto de la convocatoria con el mismo formato que
  usa el capitán) y «Editar alineación».
- Respuestas a la encuesta en cuatro grupos con contador: **Convocados** (píldora verde),
  **Pueden ir, sin convocar** (verde claro), **No pueden** (borde naranja) y **Sin responder**
  (borde discontinuo), más «Copiar recordatorio para WhatsApp» para los que no han contestado.

**Pasar lista** (construida; solo gestores)

- Título «Pasar lista», con la indicación «Solo lo veis tú y el capitán» y un candado.
- Recuento arriba (Pueden, No pueden, Sin responder) que se actualiza al tocar.
- Lista de chicos y de chicas, cada jugador con tres botones: **Sí**, **No** y **?**
  (sin responder). Todos empiezan en «?». Cada grupo indica «9 de 13 pueden».
- Se guarda solo. Botón final: «Guardar y hacer la convocatoria».
- Los comodines no aparecen aquí.

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
- Por lado: media pista partida en revés y drive con partidos y victorias en cada uno.
- Con quién juega: compañeros con barra de porcentaje de victorias (verde oscuro sobre naranja,
  que crece al aparecer) y enlace a su ficha.
- Por número de pareja («Masculino 1», «Mixto»), con la misma barra.
- Su temporada: una fila por jornada con G (círculo verde relleno), P (borde naranja) o vacío
  discontinuo (no jugó), rival, detalle («Masculino 1 con Sergio, de revés») y sets.
- Se llega desde la plantilla y desde los nombres de la convocatoria de la portada. Los comodines no tienen ficha
  pública ni enlace; los gestores sí la ven, con el aviso «Es comodín».

**Estadísticas, escritorio** (pendiente)

- Filtro «Toda la liga / Apertura / Clausura».
- **Jornada a jornada**: cuadrícula de 6 casillas por jornada (M1-M3, F1-F2, mixto), verde si
  se ganó y naranja si se perdió, con el resultado y los puntos debajo.
- **Quién con quién**: matriz de parejas (chicos, chicas o mixto) con el número de partidos
  juntos; el color, de oscuro a claro, indica el porcentaje de victorias, para que se entienda
  aunque no se distinga bien el verde del naranja.
- **Por partido**: porcentaje de victorias en M1, M2, M3, F1, F2 y mixto.
- **Parejas más repetidas**.
- **Respuestas y participación** (solo gestores): barra por jugador con jugó / podía sin
  convocar / no podía / sin responder.
- En la web real las gráficas serán interactivas con ECharts.

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
