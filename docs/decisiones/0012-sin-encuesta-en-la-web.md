# 0012. La encuesta de disponibilidad no se registra en la web

- Estado: Aceptada
- Fecha: 2026-10-13

## Contexto

El capitán pregunta por WhatsApp quién puede ir a cada jornada. La web tenía «Pasar lista»
para copiar esas respuestas a mano, y con ellas la convocatoria agrupaba a los jugadores por
lo que respondieron, avisaba de quien dijo que no y había una gráfica de participación.

Tras la primera jornada, Alex ve que pasar lista sirve para poco: lo importante es la
convocatoria, y copiar respuestas a mano es trabajo que nadie va a hacer cada semana.

## Decisión

- Se quita de la web todo lo que depende de la encuesta: la página «Pasar lista», las
  respuestas y el recordatorio en la convocatoria, la agrupación por respuesta en el selector
  de jugadores, el aviso de «dijo que no puede» y la gráfica «Respuestas y participación».
- La encuesta se sigue haciendo en WhatsApp, fuera de la web.
- La base de datos no cambia: `disponibilidad.respuesta`, `guardar_respuesta_encuesta` y la
  vista `estadistica_participacion` se quedan, sin uso, por si la encuesta vuelve.
- `disponibilidad` sigue guardando quién está convocado
  ([ADR 0009](0009-convocados-son-los-de-la-alineacion.md)).

## Consecuencias

- La convocatoria se hace directamente sobre la plantilla, sin saber desde la web quién puede.
- Si la encuesta vuelve, basta con recuperar del historial de Git el código que se borró en la
  #44; no hace falta ninguna migración.
