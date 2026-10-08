# Hoja de ruta

Estado del proyecto y lo que queda por hacer, en orden. Actualízala al terminar cada paso.
Contexto de cada decisión en [`contexto.md`](contexto.md).

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
- Documentación: `README.md`, `AGENTS.md`, `docs/` y 7 decisiones de arquitectura.

## 1. Configuración pendiente (Alex, desde los paneles)

- [ ] Primer commit y push del proyecto.
- [ ] Supabase → Authentication → URL Configuration: Site URL `http://localhost:4200` y
      Redirect URL `http://localhost:4200/**`.
- [ ] Iniciar sesión en local y darse rol `admin` (SQL en [`operativa.md`](operativa.md)).
- [ ] Desplegar en Cloudflare siguiendo [`despliegue.md`](despliegue.md) y añadir la URL de
      `workers.dev` a Site URL y Redirect URLs de Supabase.

## 2. Pantallas de gestión (prioridad alta)

Solo para gestores (`gestorGuard`), pensadas para el móvil. La jornada 1 se juega el
**sábado 10 de octubre de 2026**, así que el orden importa.

1. **Resultados de una confrontación** (primero, para meter la jornada 1 nada más jugarla).
   - Para cada uno de los 6 partidos: tipo de resultado (normal, WO a favor, WO en contra,
     abandono, suspendido) y los sets, con el tie-break cuando hay 7-6.
   - Guardar partido y sets **en una sola operación** mediante una función de PostgreSQL
     (RPC), para que nunca queden a medias.
   - Mostrar los errores de la base de datos (que ya vienen en castellano) junto al campo.
   - Decidir si el resultado global de nuestras confrontaciones (`partidos_local` y
     `partidos_visitante`) se calcula desde los partidos o lo trae el scraper. Propuesta:
     calcularlo con una vista y usar el del scraper solo para comprobar.
2. **Pasar lista**, según el boceto. Guarda en `disponibilidad` al instante y excluye a los
   comodines.
3. **Convocatoria y alineación**, según el boceto. Elegir convocados entre los que pueden y
   colocarlos en cada pista (revés y drive), «Copiar para WhatsApp» con el formato del capitán
   (ver [`contexto.md`](contexto.md)) y recordatorio para quien no ha respondido.
   - **Hace falta una migración**: un campo para marcar la convocatoria como **publicada**.
     Ahora la portada muestra cualquier alineación guardada, así que un borrador se vería en
     público.
4. **Plantilla**: alta y edición de jugadores (nombre para mostrar y completo, sexo, lado
   preferido, comodín, inscrito oficialmente).

## 3. Scraper semanal y copia de seguridad

- Carpeta `scraper/` con un script de Node que lee la página del grupo de cada fase activa
  (`fase.url_grupo`) y actualiza `equipo` (por `nombre_web`), `confrontacion` (por fase,
  jornada, local y visitante) y `fase_equipo`. Registra cada ejecución en `ejecucion_scraper`.
- GitHub Actions programado los **miércoles por la tarde** (después de las 14:00 de Madrid;
  ojo con el cambio de hora al escribir el cron en UTC). Secretos: URL de Supabase y secret key.
- Una sola petición por semana a la web de la liga; revisar antes su aviso legal y `robots.txt`.
- Comprobar si la web publica las actas o la lista oficial de inscritos; si es así, traerlas
  para rellenar `plantilla.inscrito_oficial` y avisar de convocados no inscritos.
- Si falla, no rompe nada: queda registrado y los datos se pueden corregir a mano.
- En el mismo flujo, copia de seguridad semanal con `pg_dump`, guardada de forma privada.
- La actividad semanal evita que Supabase pause el proyecto por inactividad.

## 4. Estadísticas

- Vistas en PostgreSQL (nunca cálculos en el navegador): por jugador, por pareja, por lado,
  por número de pareja, jornada a jornada y participación. Excluyen los WO de las estadísticas
  individuales ([ADR 0006](decisiones/0006-wo-fuera-de-estadisticas-individuales.md)) y
  muestran a los comodines aparte.
- Página de estadísticas y ficha de jugador según los bocetos, con gráficas interactivas de
  ECharts (`ngx-echarts`).
- Añadir «Jornadas» y «Plantilla» al menú cuando existan sus páginas públicas.

## 5. Calidad pendiente

- Tests automáticos de la base de datos con pgTAP (`supabase/tests/`, `supabase test db`),
  convirtiendo las 18 comprobaciones manuales, y añadirlos a la integración continua.
- Entorno de desarrollo separado de producción ([`entorno-local.md`](entorno-local.md)) antes
  de probar las pantallas de gestión con datos.
- Página de privacidad. Con ella, publicar la app de Google para salir del modo prueba.
- Avisar al equipo en el grupo antes de compartir la web.

## Mejoras para después

Propuestas durante el diseño, por orden aproximado de utilidad:

- **Vista previa al compartir en WhatsApp**: etiquetas Open Graph con el escudo (y quizá el
  próximo partido) para que el enlace se vea como una tarjeta.
- **Instalable en el móvil (PWA)**, que muestre lo último cargado aunque haya poca cobertura.
- **Calendario suscribible** (`.ics`) para Google Calendar o iPhone, generado por GitHub
  Actions.
- **Aviso del acta**: si jugamos en casa y el lunes no consta como enviada, mostrar un aviso
  (el plazo es el martes a las 14:00).
- **Elegibilidad para Masters Oro**: contar quién lleva al menos 2 participaciones y guardar
  los puntos FMP.
- **«Jugador anónimo»** para quien no quiera aparecer con su nombre en lo público.
- **Liga Dunlop** (enero de 2027): crear la competición con su formato cuando se conozca.
- **Disponibilidad marcada por cada jugador**, con un rol `jugador`, si el equipo se anima.
- Fotos de jugadores, dominio propio (unos 10 € al año) y avisos por correo o WhatsApp.

## Información pendiente de conseguir

- Respuestas a la encuesta de la jornada 1 (quién dijo que no y quién no contestó).
- Sede de Soto Torrejón y la nuestra para los partidos en casa.
- Fechas exactas de las jornadas 2 y 3 (llegarán con el scraper).
- Si Jess está inscrita oficialmente.
- Si el capitán quiere cuenta de gestor.
- Lado preferido de cada jugador.
- Escudo del club en vectorial (SVG) o PNG con fondo transparente.
- Formato y web de la Liga Dunlop.
