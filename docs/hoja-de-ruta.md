# Hoja de ruta

Estado del proyecto y lo que queda por hacer, en orden. Actualízala al terminar cada paso.
Contexto de cada decisión en [`contexto.md`](contexto.md).

El detalle y el estado de cada tarea están en las
[issues de GitHub](https://github.com/alex22197/ctp-valdelasfuentes/issues), agrupadas por
milestone (una por sección de este documento). Junto a cada tarea, su número.

## Hecho

- Análisis de la normativa y del funcionamiento real del equipo.
- Bocetos de las pantallas principales ([`diseno.md`](diseno.md)).
- Cuentas: GitHub, Supabase, Google Cloud (OAuth en modo prueba) y Cloudflare.
- Base de datos: esquema completo con reglas de normativa y seguridad, más datos iniciales
  (equipos, plantilla, calendario de la apertura y alineación de la jornada 1). Las
  comprobaciones de normativa se probaron a mano (18 casos).
- Web Angular 22: estructura por capas, login con Google, portada (próximo partido,
  convocatoria, clasificación y calendario), clasificación, acceso y página no encontrada.
- Calidad: TypeScript estricto, ESLint con las normas del proyecto, Prettier, hook de
  pre-commit, 22 tests, integración continua y Dependabot.
- Documentación: `README.md`, `AGENTS.md`, `docs/` y 11 decisiones de arquitectura.
- **Resultados de una confrontación** (paso 2.1): página `/resultados/:id` para gestores,
  enlazada desde el calendario de la portada. Cada partido se guarda con la función
  `guardar_resultado_partido` (partido y sets en una sola operación) y la web valida el
  marcador con las mismas reglas que la base de datos. El marcador global se calcula a partir
  de los partidos ([ADR 0008](decisiones/0008-marcador-de-la-confrontacion-calculado.md)).
  Migración probada en un PostgreSQL local (33 casos) y aplicada en Supabase.
- ~~**Pasar lista**~~ (#6, paso 2.2), **retirada** en #44 ([ADR 0012](decisiones/0012-sin-encuesta-en-la-web.md)): página `/pasar-lista/:id` para gestores, enlazada desde el
  calendario en las jornadas sin jugar. Un toque por jugador (Sí, No o ?) que se guarda al
  momento con `guardar_respuesta_encuesta`, sin perder la convocatoria de quien ya está
  convocado. Migración probada en un PostgreSQL local (11 casos) y aplicada en Supabase.
- **Convocatoria y alineación** (#7, paso 2.3): página `/convocatoria/:id` para gestores. La
  alineación se edita sobre las 6 pistas con la comprobación de normativa visible, se guarda
  entera con `guardar_alineacion` y se publica en la portada; los borradores no se ven. Textos
  para WhatsApp con el formato del capitán y recordatorio para quien no ha contestado. Los
  convocados son los de la alineación
  ([ADR 0009](decisiones/0009-convocados-son-los-de-la-alineacion.md)). Migración probada en un
  PostgreSQL local (20 casos) y aplicada en Supabase.
- **Selector de jugadores con fichas** (#33, versión 0.3.0): en la convocatoria, cada lado de
  la pista es una ficha; al tocarla sube un panel con los jugadores agrupados y buscador, y la
  ficha elegida vuela a su sitio. Probado por Alex en el móvil.
- **Reglamento explicado** (#36): página pública `/reglamento` en el menú, con la normativa
  2026-27 resumida en lenguaje llano, ejemplos, glosario y enlaces directos a cada tema.
- **Web publicada** (#5, versión 0.1.0): <https://ctp-valdelasfuentes.padel-ctp.workers.dev>.
  Cloudflare publica cada cambio que llega a `main`; el login de Google funciona en la web
  publicada. Aún no se comparte con el equipo (#19, #20).

## 1. Configuración pendiente (Alex, desde los paneles)

- [x] Primer commit y push del proyecto (rama `develop`; flujo de ramas en `AGENTS.md`).
- [x] Supabase → Authentication → URL Configuration: Site URL `http://localhost:4200` y
      Redirect URL `http://localhost:4200/**`.
- [x] Iniciar sesión en local y darse rol `admin` (SQL en [`operativa.md`](operativa.md)).
- [x] (#5) Desplegar en Cloudflare siguiendo [`despliegue.md`](despliegue.md) y añadir la URL de
      `workers.dev` a Site URL y Redirect URLs de Supabase.

## 2. Pantallas de gestión (prioridad alta)

Solo para gestores (`gestorGuard`), pensadas para el móvil. La jornada 1 se juega el
**sábado 10 de octubre de 2026**, así que el orden importa.

1. ~~**Resultados de una confrontación**~~: hecho (ver arriba).
2. ~~(#6) **Pasar lista**~~: hecho y después retirado (#44).
3. ~~(#7) **Convocatoria y alineación**~~: hecho (ver arriba).
4. (#8) **Plantilla**: alta y edición de jugadores (nombre para mostrar y completo, sexo, lado
   preferido, comodín, inscrito oficialmente).
5. ~~(#9) **Acceso a la gestión desde el menú**~~: hecho. Botón «Gestión» en la cabecera, solo
   para gestores, que lleva a `/gestion`: la próxima jornada, los resultados por meter y
   todas las jornadas con su convocatoria y sus resultados.
6. ~~(#50) **Fecha, hora y sede de una jornada**~~: hecho. Formulario en la convocatoria y en
   la próxima jornada de Gestión, con día, hora (siempre en hora de Madrid), sede y pistas.

## 3. Scraper semanal y copia de seguridad

- (#10) Carpeta `scraper/` con un script de Node que lee la página del grupo de cada fase activa
  (`fase.url_grupo`) y actualiza `equipo` (por `nombre_web`), `confrontacion` (por fase,
  jornada, local y visitante) y `fase_equipo`. Registra cada ejecución en `ejecucion_scraper`.
  **Solo datos de equipo, nunca de jugadores**
  ([ADR 0011](decisiones/0011-de-la-liga-solo-datos-de-equipo.md)).
- GitHub Actions programado los **miércoles por la tarde** (después de las 14:00 de Madrid;
  ojo con el cambio de hora al escribir el cron en UTC). Secretos: URL de Supabase y secret key.
- Una sola petición por semana a la web de la liga; revisar antes su aviso legal y `robots.txt`.
- (#12) Comprobar si la web publica la lista oficial de inscritos; si es así, traerla para rellenar `plantilla.inscrito_oficial` y avisar de convocados no inscritos.
- Si falla, no rompe nada: queda registrado y los datos se pueden corregir a mano.
- (#11) En el mismo flujo, copia de seguridad semanal con `pg_dump`, guardada de forma privada.
- La actividad semanal evita que Supabase pause el proyecto por inactividad.

## 4. Estadísticas

- ~~(#13) Vistas en PostgreSQL~~: hecho. Por jugador, por pareja, por lado, por puesto, por
  puesto del equipo, jornada a jornada y participación (solo gestores). Excluyen los WO de las
  estadísticas individuales ([ADR 0006](decisiones/0006-wo-fuera-de-estadisticas-individuales.md))
  y marcan a los comodines. Detalle en [base-de-datos.md](base-de-datos.md).
- ~~(#15) Ficha de jugador~~: hecho. Pública en `/jugadores/:id`, enlazada desde la convocatoria
  de la portada; los comodines solo la tienen para los gestores.
- ~~(#14) Página de estadísticas~~: hecha en `/estadisticas`, con gráficas de ECharts
  (`ngx-echarts`) que solo se descargan al abrirla.
- ~~(#41) Gráficas en la ficha~~: hecho. Anillo de ganados y perdidos, sets y juegos, y su
  temporada jornada a jornada.
- ~~(#40) Más gráficas en estadísticas~~: hecho. Ranking de jugadores, evolución de la
  temporada, revés contra drive y jugador resaltado en todas las gráficas.
- (#16) Páginas públicas en el menú: ~~«Plantilla»~~ hecha (`/plantilla`, chicos, chicas y
  comodines con su balance y enlace a la ficha); falta «Jornadas».

## 5. Calidad pendiente

- (#17) Tests automáticos de la base de datos con pgTAP (`supabase/tests/`, `supabase test db`),
  convirtiendo las 18 comprobaciones manuales, y añadirlos a la integración continua.
- (#18) Entorno de desarrollo separado de producción ([`entorno-local.md`](entorno-local.md)) antes
  de probar las pantallas de gestión con datos.
- (#19) Página de privacidad. Con ella, publicar la app de Google para salir del modo prueba.
- (#20) Avisar al equipo en el grupo antes de compartir la web.

## Mejoras para después

Propuestas durante el diseño, por orden aproximado de utilidad:

- (#22) **Vista previa al compartir en WhatsApp**: etiquetas Open Graph con el escudo (y quizá el
  próximo partido) para que el enlace se vea como una tarjeta.
- (#23) **Instalable en el móvil (PWA)**, que muestre lo último cargado aunque haya poca cobertura.
- (#24) **Calendario suscribible** (`.ics`) para Google Calendar o iPhone, generado por GitHub
  Actions.
- (#25) **Aviso del acta**: si jugamos en casa y el lunes no consta como enviada, mostrar un aviso
  (el plazo es el martes a las 14:00).
- (#26) **Elegibilidad para Masters Oro**: contar quién lleva al menos 2 participaciones y guardar
  los puntos FMP.
- (#27) **«Jugador anónimo»** para quien no quiera aparecer con su nombre en lo público.
- (#28) **Liga Dunlop** (enero de 2027): crear la competición con su formato cuando se conozca.
- (#29) **Disponibilidad marcada por cada jugador**, con un rol `jugador`, si el equipo se anima.
- (#30) Fotos de jugadores, dominio propio (unos 10 € al año) y avisos por correo o WhatsApp.

## Información pendiente de conseguir (#21)

- Sede de Soto Torrejón y la nuestra para los partidos en casa.
- Fechas exactas de las jornadas 2 y 3 (llegarán con el scraper).
- Si Jess está inscrita oficialmente.
- Si el capitán quiere cuenta de gestor.
- Lado preferido de cada jugador.
- Escudo del club en vectorial (SVG) o PNG con fondo transparente.
- Formato y web de la Liga Dunlop.
