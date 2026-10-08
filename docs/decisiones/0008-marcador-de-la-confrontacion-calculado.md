# 0008. El marcador de nuestras confrontaciones se calcula a partir de los partidos

- Estado: Aceptada
- Fecha: 2026-10-08

## Contexto

`confrontacion` tiene `partidos_local` y `partidos_visitante`, pensados para el resultado que
publica la liga y que traerá el scraper. En nuestras confrontaciones también guardamos cada
partido con sus sets, así que el mismo dato estaría dos veces y podría contradecirse. Además,
el scraper solo pasa los miércoles, y el resultado se quiere ver nada más jugar.

## Decisión

- La vista `confrontacion_marcador` calcula, para cada confrontación nuestra, los partidos
  ganados, perdidos y pendientes a partir de `partido_resultado` y del formato de la
  competición.
- La web muestra ese marcador cuando ningún partido está pendiente. Mientras falte alguno,
  muestra el de la liga (`partidos_local` y `partidos_visitante`), si lo hay.
- El scraper seguirá rellenando esas dos columnas para todo el grupo. En nuestras
  confrontaciones servirán para comprobar que lo que metemos coincide con lo validado por la
  liga.
- Al guardar el último resultado que faltaba, `guardar_resultado_partido` marca la
  confrontación como `jugada`. Nunca la devuelve a `programada`: si se borra un resultado
  después, el estado se corrige a mano o con el scraper.

## Consecuencias

- El resultado aparece en la portada en cuanto se meten los seis partidos, sin esperar al
  scraper.
- Si nuestro marcador y el de la liga no coinciden, manda el nuestro en la web. El scraper
  deberá avisar de la diferencia.
- La portada pasa al siguiente partido cuando se completan los resultados de la jornada.
