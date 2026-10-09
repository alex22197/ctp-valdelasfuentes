# 0009. Los convocados son los de la alineación

- Estado: Aceptada
- Fecha: 2026-10-09

## Contexto

`disponibilidad.convocado` dice quién está convocado y `participacion` dice quién juega cada
partido. Si se editan por separado, pueden contradecirse: alguien convocado sin pista o
alguien en una pista sin estar convocado. En la realidad, el capitán convoca colocando a la
gente en las pistas.

## Decisión

- Estar convocado es estar colocado en la alineación. Solo `guardar_alineacion` escribe
  `disponibilidad.convocado`, en la misma transacción que las parejas.
- Al guardar, los colocados quedan convocados conservando lo que respondieron a la encuesta.
  Quien deja de estar colocado pierde la convocatoria; si tampoco había respondido (por
  ejemplo, un comodín), su fila desaparece.
- Pasar lista nunca cambia `convocado`: volver a «sin responder» a alguien convocado solo
  borra su respuesta.
- Un WO en contra quita la pareja del partido, pero no la convocatoria: esas personas
  estaban convocadas, aunque al final no jugaran.

## Consecuencias

- No puede haber convocados sin pista ni jugadores sin convocar.
- Para cambiar la convocatoria hay que cambiar la alineación, y viceversa.
- La portada solo muestra la alineación si `confrontacion.convocatoria_publicada` es
  verdadero. Los borradores se pueden leer por la API, porque `participacion` es pública,
  pero la web no los enseña.
