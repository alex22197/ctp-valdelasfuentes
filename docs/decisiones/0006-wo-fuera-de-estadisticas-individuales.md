# 0006. Los WO no cuentan en las estadísticas de cada jugador

- Estado: Aceptada
- Fecha: 2026-10-08

## Contexto

Un WO cuenta en la clasificación según la normativa, pero no dice nada de cómo juega nadie:
perder porque la pareja no se presentó no es una derrota en pista.

## Decisión

- En la clasificación y en los resultados del equipo, los WO cuentan como dicta la normativa.
- En las estadísticas de cada jugador (porcentaje de victorias, parejas, lados), los WO se
  excluyen y se muestran aparte.

## Consecuencias

- Las vistas de estadísticas filtran por `resultado = 'normal'` o `'abandono'`.
