# 0005. Si un partido se ganó se calcula a partir de los sets

- Estado: Aceptada
- Fecha: 2026-10-08

## Contexto

Guardar a la vez los sets y un campo `ganado` permite contradicciones (sets 6-4 6-3 y
`ganado = false`), y obligaría a validar en un orden concreto al ir metiendo los sets.

## Decisión

- La vista `partido_resultado` calcula si se ganó: por sets en un partido normal y por el tipo
  de WO en los WO.
- El campo `ganado` solo se rellena en los abandonos, donde los sets no lo deciden. Una
  restricción impide rellenarlo en cualquier otro caso.
- Un partido con `resultado` vacío está por jugar: así se puede guardar la alineación antes
  del partido.

## Consecuencias

- Es imposible guardar un resultado incoherente.
- Las estadísticas siempre leen de `partido_resultado`, nunca de `partido.ganado`.
