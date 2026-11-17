# 0013. Los estados con varias fases se modelan con uniones discriminadas

- Estado: Aceptada
- Fecha: 2026-11-17

## Contexto

Un inventario de la web, el scraper y la base de datos encontró 17 sitios donde algo pasa por
varias fases (una acción que tarda, la carga de una página, el ciclo de una jornada, una
cuenta que pide permisos…) y solo dos tenían un tipo de estado con nombre. El resto se
representaba con combinaciones de booleanos (`ocupado`, `error`, `hayCambios`), strings
sueltos, contadores o temporizadores. Eso permite estados imposibles («guardando» y «con
error» a la vez), obliga a inferir el éxito de una acción por efectos indirectos (que cambie
un dato), repite el mismo `try/finally` en seis ficheros con mensajes distintos y hace que
cada página resuelva la carga a su manera. Para quien llega al código, persona o asistente,
no hay un sitio donde ver qué estados existen.

## Decisión

- Un estado con varias fases se modela con un **tipo de unión discriminada** en su carpeta
  `interfaces/`: cada variante lleva su `tipo` y solo los datos que tienen sentido en ella (el
  error, su mensaje). Nada de booleanos sueltos que puedan contradecirse.
- Las acciones que tardan usan un único `AccionConEstado` (`shared/utils`), con el estado
  `inactivo | en-curso | hecho | error{mensaje}`: no lanza dos veces a la vez, y «hecho» es
  un estado real al que la pantalla reacciona (cerrar el formulario, avisar).
- Lo que depende del tiempo se calcula con funciones puras que reciben «hoy», con test.
- [`docs/estados.md`](../estados.md) es el catálogo: qué máquinas hay, sus estados, quién las
  cambia y sus lagunas. Se actualiza en el mismo cambio que las toca.
- Se aplica primero donde el patrón estaba más repetido y era menos delicado: la fecha de la
  jornada, el acceso y los resultados. La edición de la alineación, los permisos y copiar la
  convocatoria pasan después, uno a uno, sin tocar lo que se usa el día de partido sin probarlo.

## Consecuencias

- Menos errores de interfaz: no hay dobles envíos ni formularios que se cierran por una
  recarga ajena, y el mensaje de error es siempre el del servicio de datos.
- Un patrón para todos: quien añade una acción nueva usa `AccionConEstado` y un `estado` con
  tipo; el linter y TypeScript avisan si se compara con un valor que no existe.
- El catálogo deja a la vista las lagunas (estados que nadie escribe, reglas repetidas en dos
  capas) para corregirlas con criterio y no al tropezar con ellas.
- Hay que mantener `docs/estados.md`; a cambio, la revisión de un cambio empieza por ahí.
