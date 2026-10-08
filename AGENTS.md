# AGENTS.md

Guía para cualquier persona o asistente de IA (Claude Code, Codex, Cursor, Copilot…) que
trabaje en este repositorio. Es la única fuente de las convenciones del proyecto: `CLAUDE.md`
solo la importa.

Las reglas marcadas con **(automática)** las comprueba ESLint, Prettier o TypeScript: si no se
cumplen, el commit se rechaza.

## Contexto

Web del equipo de pádel CTPA Valdelasfuentes (Liga MasterPadel, 4ª División, zona 1).
Pública para consultar; con login de Google para que el administrador y el capitán gestionen
datos.

**Al empezar a trabajar, lee en este orden:**

1. [`docs/contexto.md`](docs/contexto.md): el equipo, las personas, cómo funciona una jornada
   en la realidad y las decisiones de producto.
2. [`docs/hoja-de-ruta.md`](docs/hoja-de-ruta.md): qué está hecho y qué toca ahora.
3. [`docs/arquitectura.md`](docs/arquitectura.md) y, según la tarea,
   [`docs/base-de-datos.md`](docs/base-de-datos.md), [`docs/diseno.md`](docs/diseno.md) o
   [`docs/normativa-liga.md`](docs/normativa-liga.md).

Al terminar un paso de la hoja de ruta, márcalo como hecho en ese mismo documento.

## Antes de terminar cualquier cambio

```bash
npm run verificar --prefix web
```

Ejecuta linter, formato, tests y compilación, igual que la integración continua. Un cambio
no está terminado hasta que pasa.

## Estructura

```
supabase/migrations/   Esquema de la base de datos, una migración por cambio
web/src/app/
  core/                Lo que existe una sola vez: configuración, cliente de Supabase,
                       sesión, enrutado y esqueleto de la app (cabecera, navegación)
  data-access/         Un servicio por entidad que habla con Supabase, más su mapeador
                       y sus interfaces de dominio
  shared/              Componentes, pipes y utilidades reutilizables, sin acceso a datos
  features/            Una carpeta por sección de la web, con pages/, components/,
                       services/ e interfaces/ según necesite
web/src/styles/        Sistema de diseño (variables) y estilos globales
docs/                  Documentación
```

Detalle en [`docs/arquitectura.md`](docs/arquitectura.md).

## Reglas de código

### Ficheros y lenguajes

- Cada lenguaje en su fichero: plantillas en `.html`, estilos en `.scss`, lógica en `.ts`.
  Nada de `template:` ni `styles:` en los componentes. **(automática)**
- Nada de estilos en línea en las plantillas (`style="…"`); los enlaces de datos tipo
  `[style.x]` solo para valores calculados. **(automática)**
- Nada de SQL dentro del TypeScript: las consultas complejas van como vistas o funciones en
  una migración.
- Iconos como ficheros en `web/public/iconos/`, usados con `<ctp-icono nombre="…" />`.
- Máximo 200 líneas por fichero `.ts` (sin contar comentarios). Si crece, se divide. **(automática)**

### Nombres

- **Dominio en castellano**, igual que la base de datos: `jugador`, `confrontacion`,
  `JugadoresService`, `obtenerClasificacion()`.
- **Términos técnicos en inglés**, como los usa Angular: `component`, `service`, `guard`,
  `pipe`, `mapper`.
- Ficheros en `kebab-case` con sufijo de tipo:
  `tabla-clasificacion.component.ts`, `clasificacion.service.ts`, `gestor.guard.ts`,
  `confrontacion.mapper.ts`, `fila-clasificacion.interface.ts`, `rol-usuario.type.ts`.
- Los nombres deben entenderse sin abrir el fichero: `datos-inicio.service.ts`, no `data.ts`.
- Prefijo de selectores: `ctp-`. **(automática)**

### Interfaces y tipos

- Viven en una carpeta `interfaces/` junto al código que las define: una interfaz o tipo
  por fichero, con sufijo `.interface.ts` o `.type.ts`.
- Las interfaces de dominio usan `camelCase` y `readonly`. Las filas de la base de datos
  (`snake_case`) solo aparecen en los mapeadores.
- Los tipos de la base de datos (`core/supabase/interfaces/database.types.ts`) se generan
  con `npm run db:tipos`. **No se editan a mano.**
- TypeScript estricto: sin `any` y con tipo de retorno explícito en las funciones. **(automática)**

### Angular

- Componentes standalone con `ChangeDetectionStrategy.OnPush`. **(automática)**
- Estado con signals (`signal`, `computed`, `input`, `resource`); nada de `@Input()` ni
  `@Output()` con decoradores. **(automática)**
- Control de flujo nuevo en plantillas: `@if`, `@for`, `@let`. **(automática)**
- `inject()` en lugar de inyección por constructor.
- Rutas con carga diferida (`loadComponent`) y `title` en castellano.
- Páginas y componentes visuales separados: la página (`pages/`) obtiene los datos y los
  pasa por `input()` a componentes (`components/`) que solo los muestran.

### Capas

- Las páginas y componentes **no** importan Supabase: usan un servicio de `data-access/`.
  **(automática)**
- Cada servicio de `data-access/` devuelve interfaces de dominio pasando por su mapeador,
  y convierte los errores en `ErrorAccesoDatos` con un mensaje en castellano.
- La lógica que se pueda escribir como función pura (cálculos, elección de fases,
  formato de fechas) va en un fichero propio con su test.

### Estilos

- Colores, espacios, radios y tipografía solo con las variables de
  `web/src/styles/_tokens.scss`; nunca valores sueltos.
- Puntos de corte con `@use 'breakpoints' as bp;` y `@include bp.desde(tablet)`.
- Clases globales reutilizables en `web/src/styles/_tipografia.scss`
  (`titulo-pagina`, `titulo-seccion`, `texto-secundario`, `boton`).

### Accesibilidad

- Reglas de accesibilidad de plantillas activadas. **(automática)**
- Objetivos táctiles de al menos 44 px, foco visible y textos alternativos.
- Textos de la interfaz en castellano, claros y en voz activa: «Entrar con Google»,
  no «Autenticarse».

## Tests

- Vitest con el runner de Angular (`npm test --prefix web`).
- Obligatorio para funciones puras, mapeadores y guards. Recomendado para componentes con
  lógica de presentación.
- El fichero de test va junto al código: `fase-actual.ts` → `fase-actual.spec.ts`.

## Base de datos

- Todo cambio de esquema es una migración nueva (`npm run db:nueva-migracion -- <nombre>`);
  nunca se edita una migración ya aplicada ni se cambia el esquema desde el panel de Supabase.
- Cada tabla nueva: RLS activado, políticas explícitas y `grant` solo de lo necesario (el
  proyecto no expone tablas automáticamente).
- Las reglas de la normativa se aplican en la base de datos (restricciones y triggers),
  no solo en la web.
- Tras aplicar la migración, `npm run db:tipos`.

Detalle en [`docs/base-de-datos.md`](docs/base-de-datos.md).

## Git

- Commits en castellano con prefijo convencional: `feat:`, `fix:`, `docs:`, `refactor:`,
  `test:`, `chore:`. Ejemplo: `feat: pantalla de pasar lista`.
- El hook de pre-commit pasa ESLint y Prettier a los ficheros modificados.
- Nunca se suben secretos: la clave secreta de Supabase y la contraseña de la base de datos
  solo viven en los secretos de GitHub y en el gestor de contraseñas.

## Decisiones

Las decisiones de arquitectura se registran en [`docs/decisiones/`](docs/decisiones/). Si
un cambio contradice una, se escribe una nueva que la sustituya.

## Mantener esta guía

- Si cambia una convención, se actualiza este fichero en el mismo commit.
- No se duplican reglas en `CLAUDE.md` ni en otros ficheros de asistentes: todos apuntan aquí.
