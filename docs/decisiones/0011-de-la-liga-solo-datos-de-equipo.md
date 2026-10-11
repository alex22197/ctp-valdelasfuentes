# 0011. De la web de la liga solo se importan datos de equipo

- Estado: Aceptada
- Fecha: 2026-10-11

## Contexto

El scraper (#10) leerá la web de la liga, que publica la clasificación, el calendario y los
resultados del grupo a partir de las actas. Alex avisa de que los jugadores que constan en el
acta no siempre coinciden con los que juegan de verdad, así que los datos de jugadores de la
liga no son fiables para nuestras estadísticas.

## Decisión

- De la liga se importan **solo datos de equipo**: clasificación (`fase_equipo`), calendario y
  resultado global de cada confrontación del grupo (`confrontacion`).
- **Nunca** se importan datos de jugadores: ni parejas, ni quién jugó cada partido, ni sus
  sets o resultados individuales.
- Quién jugó y cómo quedó cada partido de nuestro equipo sale únicamente de lo que meten los
  gestores en la web. Las estadísticas de jugadores (#13, #14, #15) se calculan solo con eso.
- En nuestras confrontaciones manda nuestro marcador
  ([ADR 0008](0008-marcador-de-la-confrontacion-calculado.md)); el de la liga solo sirve para
  avisar si no coinciden.

## Consecuencias

- Si la liga publicara también actas con jugadores, el scraper las ignora.
- La lista oficial de inscritos (#12), si existe, sí puede usarse para saber quién está dado de
  alta (`plantilla.inscrito_oficial`), porque no es un resultado de partido.
