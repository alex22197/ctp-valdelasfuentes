# Estados de la aplicación

Catálogo de todo lo que tiene varias fases en la web, el scraper y la base de datos: qué
estados existen de verdad, quién los cambia y qué puede ir mal. Sirve para no reinventar un
estado con booleanos sueltos y para saber dónde mirar cuando algo «se queda a medias».
La convención está en el [ADR 0013](decisiones/0013-estados-con-uniones-discriminadas.md).

## Cómo se modela un estado

- Un estado con varias fases es un **tipo de unión discriminada** en `interfaces/`
  (`EstadoAccion`, `EstadoFase`, `EstadoConfrontacion`…), nunca dos o tres booleanos que
  puedan contradecirse («guardando» y «error» a la vez).
- Una acción que tarda (guardar, publicar, entrar) usa `AccionConEstado`
  (`shared/utils/accion-con-estado.ts`): `inactivo → en-curso → hecho | error{mensaje}`. No
  admite dos lanzamientos a la vez, y «hecho» es un estado real al que una pantalla puede
  reaccionar (cerrar un formulario), en vez de adivinar el éxito por si cambian los datos.
- Lo que se deriva del tiempo (qué fase se juega, cuál es el próximo partido) se calcula con
  funciones puras que reciben «hoy» en AAAA-MM-DD de Madrid, y tienen test.

## Catálogo

| Máquina                               | Estados                                                                                             | Quién la cambia                                                                                                                                                            | Dónde vive                                                                                                                |
| ------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Confrontación**                     | programada, aplazada, suspendida, jugada, no_comparecencia; aparte: convocatoria borrador/publicada | BD (`guardar_resultado_partido` → jugada), scraper (crea; jugada en las de otros), gestor (aplazar, suspender o volver a programar con `cambiar_estado_jornada`; publicar) | enum `estado_confrontacion`; `data-access/confrontaciones/proxima-confrontacion.ts`; `scraper/src/planificar-*.ts`        |
| **Fase**                              | próxima, en juego, terminada (derivado de `inicio`, `fin`, `orden` y hoy)                           | El tiempo                                                                                                                                                                  | `data-access/competiciones/fase-actual.ts`, `estado-fase.ts`; `scraper/src/fase-activa.ts` (+7 días de margen)            |
| **Resultado de un partido**           | por jugar (`null`), normal, WO a favor, WO en contra, abandono (ganado/perdido), suspendido         | Gestor, con `guardar_resultado_partido`                                                                                                                                    | enum SQL + `validar_marcador` (SQL y `data-access/resultados/validar-marcador.ts`, misma regla en las dos capas)          |
| **Acción que tarda**                  | inactivo, en-curso, hecho, error{mensaje}                                                           | Usuario y respuesta de red                                                                                                                                                 | `shared/utils/accion-con-estado.ts`: fecha de la jornada (convocatoria y gestión), acceso, guardado de cada resultado     |
| **Formulario de datos de la jornada** | cerrado, abierto, aviso de validación, en curso, error; se cierra al quedar hecho                   | Usuario; el `estado` del padre                                                                                                                                             | `shared/components/datos-jornada`                                                                                         |
| **Edición de la alineación**          | cargando, limpia (borrador/publicada), con cambios (válidos/con errores), guardando, error          | Capitán; red                                                                                                                                                               | `features/convocatoria/services/datos-convocatoria.service.ts` (`huecos`, `hayCambios`, `hayErrores`, `ocupado`, `error`) |
| **Selector de jugadores**             | cerrado, abierto, eligiendo, ficha en vuelo                                                         | Usuario; View Transitions                                                                                                                                                  | `features/convocatoria` (`abierto`, `enVuelo`) y `shared/services/transicion-vista.service.ts`                            |
| **Copiar la convocatoria**            | no copiable, lista, generando, copiada, sin soporte (compartir/descargar), error                    | Usuario; portapapeles                                                                                                                                                      | `features/convocatoria/components/copiar-convocatoria`                                                                    |
| **Cuenta y permisos**                 | invitada sin entrar, nueva sin revisar, descartada, capitán, administrador, exgestor                | Administrador (dar, cambiar, quitar, descartar); usuario al entrar                                                                                                         | tablas `perfil`, `invitacion_gestor`, `cuenta_revisada`; `features/gestion/services/gestores-gestion.service.ts`          |
| **Sesión**                            | inicializando, visitante, autenticado sin rol, capitán, administrador                               | Arranque y eventos de Supabase                                                                                                                                             | `core/auth/auth.service.ts` (`lista`, `sesion`, `rol`)                                                                    |
| **Consentimiento de cookies**         | pendiente, aceptado, rechazado (+ reabierto); analítica no cargada / midiendo / silenciada          | Usuario; caduca al año                                                                                                                                                     | `core/analitica`                                                                                                          |
| **Espera global (Libra)**             | inactiva, esperando (400 ms), visible, retenida (hasta 1 s)                                         | Cada petición a Supabase y temporizadores                                                                                                                                  | `core/supabase/peticiones-en-curso.service.ts`                                                                            |
| **Carga de una página**               | cargando, error, vacío (sin competición, no encontrado…), lista                                     | Resources                                                                                                                                                                  | Un `estado` por servicio de página (`gestion`, `estadisticas`, `ficha-jugador`) o `@if` en la plantilla                   |
| **Lectura de la liga**                | nunca, al día, con avisos, con error, sin leer (más de 8 días)                                      | Scraper semanal; el tiempo                                                                                                                                                 | `features/gestion/utils/estado-lectura-liga.ts` (`EstadoLecturaLiga`) y `data-access/scraper`                             |
| **Confirmación en dos pasos**         | inactivo, confirmando (por correo)                                                                  | Usuario                                                                                                                                                                    | `features/gestion/components/lista-gestores` y `cuentas-nuevas`                                                           |

## Reglas que hay que respetar al tocarlas

- **Confrontación.** «Por jugar» son `programada`, `aplazada` y `suspendida`
  (`ESTADOS_POR_JUGAR`, `estaPorJugar`); entre ellas se va y se vuelve desde Gestión. Terminadas
  son `jugada` y `no_comparecencia`: ya no se convocan ni cambian de fecha, y la base de datos
  impide que cambien de estado (`validar_estado_confrontacion`). Se llega a `jugada` cuando no
  queda ningún partido pendiente, o por el scraper en las de otros equipos.
- **Aplazada o suspendida.** Al marcarla, `cambiar_estado_jornada` le borra la fecha: deja de
  ser «el partido de hoy» y queda «por confirmar» hasta que se ponga la nueva. La fecha que
  tenga después es la nueva, así que se comporta como una programada: es la próxima hasta ese
  día y, si pasa sin resultados, sale en «Resultados por meter». Si no se llegó a jugar, se
  vuelve a aplazar. En el calendario, la tarjeta de Gestión y el próximo partido sale una
  etiqueta ámbar.
- **WO de todo el equipo.** Se mete en Resultados como WO en los seis partidos: la jornada pasa
  a `jugada` con su 6-0 o 0-6, que es lo que publica la liga y lo que cuentan las estadísticas
  del equipo. `no_comparecencia` existe en el enum pero no lo escribe nadie; si apareciera, la
  web lo trata como terminada y las estadísticas lo dejan fuera.
- **Marcador.** El de las nuestras se calcula
  ([ADR 0008](decisiones/0008-marcador-de-la-confrontacion-calculado.md)).
- **Fase.** La web elige la fase en curso con `elegirFaseActual`; el scraper sigue leyendo una
  fase una semana después de su `fin`, por si la liga corrige algo. Son dos reglas distintas a
  propósito.
- **Acción que tarda.** Nunca se duplica el patrón `ocupado`/`error` con `try/finally`: se usa
  `AccionConEstado`. El mensaje de error viene del servicio de datos, en castellano.
- **Formularios con borrador** (`linkedSignal` sobre lo guardado): el borrador solo se
  resetea al cerrar o al quedar hecha la acción, no por cualquier recarga.

## Lagunas conocidas

Están apuntadas en la issue de hallazgos del inventario (noviembre de 2026):

- Si se borra un resultado después de cerrar una jornada queda `jugada` sin marcador y
  desaparece de «Resultados por meter». Para arreglarlo, `guardar_resultado_partido` tendría
  que devolverla a `programada`, y el trigger `validar_estado_confrontacion` hoy lo impide:
  habrá que permitir esa vuelta atrás solo desde la función.
- La edición de la alineación, los permisos de gestores y copiar la convocatoria siguen con
  señales sueltas (`ocupado`, `error`, `aviso`): son las siguientes en pasar a `AccionConEstado`.
  En gestores, el `aviso` de éxito borra el correo que se estaba escribiendo.
- La carga de página tiene cuatro variantes (orden de error/carga, esqueleto al recargar o no,
  nombres del estado vacío). Falta un criterio único.
- Para el resultado de un jugador hay tres tipos derivados (`EstadoCasilla`, `EstadoForma`,
  `ResultadoEnJornada` + `esWo`).
- No hay tests de la base de datos (#17): las transiciones en SQL solo se prueban a mano.
