# Diseño

## Bocetos

Los bocetos aprobados están en un lienzo de Claude:
<https://claude.ai/artifact/KxsiGwjSb2K65SrSfu2CSp> (privado de Alex). Este documento los
describe para quien no pueda abrirlo. Los datos de los bocetos son de ejemplo, salvo
clasificación, calendario y nombres.

### Principios

- **Pensado para el móvil**: casi todo el equipo entrará desde WhatsApp. En escritorio el
  menú sube a la cabecera.
- **La pista de pádel es el elemento característico**, y solo ella lleva el protagonismo: el
  resto de la interfaz es sobrio.
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

**Jornada y convocatoria, vista de capitán** (pendiente)

- Rival en grande, fecha y sede.
- Alineación sobre las 6 mini pistas, con estado «Borrador» o «Publicada».
- Comprobación de normativa visible: «Cumple la normativa: las 6 parejas están completas y nadie
  del mixto repite».
- Botones «Copiar para WhatsApp» (genera el texto de la convocatoria con el mismo formato que
  usa el capitán) y «Editar alineación».
- Respuestas a la encuesta en cuatro grupos con contador: **Convocados** (píldora verde),
  **Pueden ir, sin convocar** (verde claro), **No pueden** (borde naranja) y **Sin responder**
  (borde discontinuo), más «Copiar recordatorio para WhatsApp» para los que no han contestado.

**Pasar lista** (pendiente; solo gestores)

- Título «Pasar lista», con la indicación «Solo lo veis tú y el capitán» y un candado.
- Recuento arriba (Pueden, No pueden, Sin responder) que se actualiza al tocar.
- Lista de chicos y de chicas, cada jugador con tres botones: **Sí**, **No** y **?**
  (sin responder). Todos empiezan en «?». Cada grupo indica «9 de 13 pueden».
- Se guarda solo. Botón final: «Guardar y hacer la convocatoria».
- Los comodines no aparecen aquí.

**Ficha de jugador** (pendiente)

- Nombre en grande, sexo y lado habitual.
- Marcador con partidos, ganados y sets (por ejemplo «6–5»).
- Por lado: media pista partida en revés y drive con partidos y victorias en cada uno.
- Con quién juega: compañeros con barra de porcentaje de victorias.
- Por número de pareja (1, 2, 3).
- Su temporada: una fila por jornada con G (ganado), P (perdido) o vacío (no jugó), rival,
  detalle («Pareja 1 con Sergio, de revés») y sets.

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
