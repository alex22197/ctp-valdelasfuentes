# 0003. Nombres del dominio en castellano y técnicos en inglés

- Estado: Aceptada
- Fecha: 2026-10-08

## Contexto

La base de datos y la normativa están en castellano (`jugador`, `confrontacion`, `plantilla`).
Mezclar idiomas en el dominio (`player` en el código, `jugador` en la base de datos) obliga a
traducir mentalmente en cada fichero.

## Decisión

- Conceptos del dominio en castellano en todo el código: `JugadoresService`,
  `obtenerClasificacion()`, `FilaClasificacion`.
- Términos técnicos de Angular y de programación en inglés: `component`, `service`, `guard`,
  `mapper`, `resource`.
- Documentación y textos de la interfaz en castellano.

## Consecuencias

- Cada pieza del código corresponde directamente con su tabla y con la normativa.
- Se evita la ñ y las tildes en identificadores (`anadir`, `posicion`) por compatibilidad.
