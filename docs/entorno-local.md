# Entorno local

Cómo preparar un ordenador para trabajar en el proyecto desde cero.

## Requisitos

- **Node.js 24 LTS** (vale también 22.22.3 o superior), desde [nodejs.org](https://nodejs.org).
  Compruébalo con `node --version`.
- **Git**. Compruébalo con `git --version`.
- Recomendado: **VS Code**. Al abrir el repositorio te propondrá las extensiones de Angular,
  ESLint, Prettier y EditorConfig; con ellas el código se formatea solo al guardar.

## Primera vez

```bash
git clone https://github.com/alex22197/ctp-valdelasfuentes.git
cd ctp-valdelasfuentes

npm install               # Supabase CLI y hooks de Git (husky)
npm install --prefix web  # dependencias de la web
```

### Conectar con Supabase

Solo hace falta para aplicar migraciones o regenerar tipos.

```bash
npx supabase init                                        # crea supabase/config.toml (responde «no» a VS Code y Deno)
npx supabase login                                       # abre el navegador para autorizar
npx supabase link --project-ref wqnelcngcnubwtymnmjk     # pide la contraseña de la base de datos
npm run db:migrar                                        # aplica las migraciones pendientes
```

La contraseña de la base de datos está en el gestor de contraseñas. Nunca se guarda en el
repositorio.

## Día a día

```bash
npm start --prefix web            # http://localhost:4200 con recarga automática
npm test --prefix web             # tests en modo vigilancia
npm run verificar --prefix web    # todo lo que comprueba la integración continua
```

Al hacer `git commit`, el hook de pre-commit pasa ESLint y Prettier a los ficheros modificados
y rechaza el commit si algo no cumple las normas de [`AGENTS.md`](../AGENTS.md).

## Base de datos de desarrollo

Ahora mismo `npm start` usa **la misma base de datos que la web publicada**. Para consultar no
importa, pero cuando haya pantallas de gestión no conviene probar con los datos reales.
Hay dos opciones gratuitas:

1. **Supabase en local con Docker** (recomendada). Instala Docker Desktop y ejecuta
   `npx supabase start`: levanta una copia completa de Supabase en tu ordenador con las
   migraciones aplicadas. La URL y la _publishable key_ locales que muestra van en
   `web/src/environments/environment.development.ts`. Para borrarla y empezar de cero:
   `npx supabase db reset`.
2. **Un segundo proyecto de Supabase** solo para desarrollo (el plan gratuito permite dos).
   Se le aplican las mismas migraciones y sus datos de conexión van en
   `environment.development.ts`.

## Problemas frecuentes

| Problema                                              | Solución                                                                                                   |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `The Angular CLI requires a minimum Node.js version…` | Actualiza Node.js a la versión 24 LTS.                                                                     |
| El commit se rechaza                                  | Lee el error: indica el fichero, la línea y la regla. `npm run formatear --prefix web` corrige el formato. |
| `npm run db:tipos` falla                              | Falta `npx supabase login` o `npx supabase link`.                                                          |
