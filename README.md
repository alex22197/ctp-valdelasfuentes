# CTP Valdelasfuentes

Web del equipo **CTPA Valdelasfuentes** en la Liga MasterPadel: calendario, clasificación,
convocatorias, alineaciones y, más adelante, estadísticas de cada jugador.

- **En línea** en <https://ctp-valdelasfuentes.padel-ctp.workers.dev> (Cloudflare Workers,
  publicada desde `main`).
- **Pública**: cualquiera con el enlace puede verla, sin cuenta.
- **Gestión con login de Google**: solo el administrador y el capitán pueden modificar datos.

## Cómo está hecha

| Pieza                      | Tecnología                                 | Dónde                                        |
| -------------------------- | ------------------------------------------ | -------------------------------------------- |
| Web                        | Angular 22 (standalone, signals, zoneless) | [`web/`](web/)                               |
| Base de datos, API y login | Supabase (PostgreSQL + RLS)                | [`supabase/`](supabase/)                     |
| Alojamiento                | Cloudflare Workers (sitio estático)        | [`web/wrangler.jsonc`](web/wrangler.jsonc)   |
| Comprobaciones automáticas | GitHub Actions, husky y lint-staged        | [`.github/`](.github/), [`.husky/`](.husky/) |

Todo funciona con los planes gratuitos y sin servidor propio. El porqué de cada elección está
en [`docs/decisiones/`](docs/decisiones/).

## Puesta en marcha

Requisitos: **Node.js 24 LTS** (o 22.22.3 o superior) y Git.

```bash
git clone https://github.com/alex22197/ctp-valdelasfuentes.git
cd ctp-valdelasfuentes
npm install            # herramientas de la raíz: Supabase CLI y hooks de Git
npm install --prefix web
npm start --prefix web # http://localhost:4200
```

La guía completa, incluida la base de datos, está en
[`docs/entorno-local.md`](docs/entorno-local.md).

## Comandos habituales

| Comando                                  | Qué hace                                                                    |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| `npm start --prefix web`                 | Arranca la web en local con recarga automática.                             |
| `npm run verificar --prefix web`         | Linter, formato, tests y compilación: lo mismo que la integración continua. |
| `npm test --prefix web`                  | Tests en modo vigilancia.                                                   |
| `npm run db:nueva-migracion -- <nombre>` | Crea una migración vacía en `supabase/migrations/`.                         |
| `npm run db:migrar`                      | Aplica las migraciones pendientes en Supabase.                              |
| `npm run db:tipos`                       | Regenera los tipos de TypeScript desde la base de datos.                    |

## Documentación

| Documento                                          | Contenido                                                                                     |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [`AGENTS.md`](AGENTS.md)                           | Convenciones y reglas del proyecto, para personas y asistentes de IA. `CLAUDE.md` lo importa. |
| [`docs/contexto.md`](docs/contexto.md)             | El equipo, cómo funciona una jornada y decisiones de producto.                                |
| [`docs/hoja-de-ruta.md`](docs/hoja-de-ruta.md)     | Qué está hecho, qué toca ahora y mejoras para después.                                        |
| [`docs/arquitectura.md`](docs/arquitectura.md)     | Estructura de carpetas, capas y flujo de datos.                                               |
| [`docs/base-de-datos.md`](docs/base-de-datos.md)   | Tablas, reglas de la normativa, seguridad y migraciones.                                      |
| [`docs/normativa-liga.md`](docs/normativa-liga.md) | Resumen de la normativa de la liga y dónde se aplica cada regla.                              |
| [`docs/diseno.md`](docs/diseno.md)                 | Bocetos de las pantallas y sistema visual.                                                    |
| [`docs/operativa.md`](docs/operativa.md)           | Qué hacer cada semana de jornada y tareas de administración.                                  |
| [`docs/entorno-local.md`](docs/entorno-local.md)   | Preparar el ordenador para desarrollar.                                                       |
| [`docs/despliegue.md`](docs/despliegue.md)         | Publicación en Cloudflare, configuración de Supabase y secretos.                              |
| [`docs/decisiones/`](docs/decisiones/)             | Registro de decisiones de arquitectura (ADR).                                                 |
