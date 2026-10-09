# Despliegue

La web se publica sola en Cloudflare cada vez que se sube un cambio a `main`, siempre que
pasen el linter y los tests.

## Cloudflare (una sola vez)

1. En el panel de Cloudflare, ve a **Workers & Pages** → **Create** → **Import a repository**
   y conecta tu cuenta de GitHub dando acceso al repositorio `ctp-valdelasfuentes`.
2. Configura la compilación:

   | Campo             | Valor                      |
   | ----------------- | -------------------------- |
   | Project name      | `ctp-valdelasfuentes`      |
   | Production branch | `main`                     |
   | Root directory    | `web`                      |
   | Build command     | `npm run build:cloudflare` |
   | Deploy command    | `npx wrangler deploy`      |

   La versión de Node la toma de `web/.nvmrc`; no hace falta ninguna variable de entorno.
   Si **Root directory** se queda vacío, Cloudflare compila desde la raíz del repositorio y
   falla con `Missing script: "build:cloudflare"`.

3. Desactiva **Builds for non-production branches**: solo se publica lo que llega a `main`.
4. Guarda y despliega. La web quedará en
   `https://ctp-valdelasfuentes.<tu-subdominio>.workers.dev`.

## Publicar una versión

1. Pull request de `develop` a `main` titulada «Publicación X.Y.Z», con la lista de lo que
   entra.
2. Cuando la integración continua está en verde, se integra con un merge commit y se etiqueta
   `main` con `vX.Y.Z`.
3. Cloudflare compila y publica solo. Si el linter o los tests fallan, no se publica nada y
   la versión anterior sigue en línea.

Versiones: la cifra del medio sube con funcionalidades nuevas (0.2.0) y la última con
correcciones (0.2.1).

`build:cloudflare` ejecuta linter y tests antes de compilar: si algo falla, no se publica.
La configuración del sitio está en [`web/wrangler.jsonc`](../web/wrangler.jsonc); la opción
`single-page-application` hace que cualquier ruta de Angular (`/clasificacion`, `/acceso`…)
funcione al recargar la página.

## Supabase: direcciones permitidas para el login

En **Authentication** → **URL Configuration**:

| Campo         | Valor                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------- |
| Site URL      | `https://ctp-valdelasfuentes.<tu-subdominio>.workers.dev`                                 |
| Redirect URLs | `https://ctp-valdelasfuentes.<tu-subdominio>.workers.dev/**` y `http://localhost:4200/**` |

Sin esto, después de iniciar sesión con Google Supabase no sabría a qué web devolverte.

## Google (login)

- Las credenciales OAuth están en Google Cloud Console, proyecto **CTP Valdelasfuentes**.
- La app está en **modo prueba**: solo pueden iniciar sesión las cuentas añadidas en
  **Público** → **Usuarios de prueba**. Añade ahí a cada gestor nuevo.
- Para publicarla (no es necesario), Google pide una página principal y una política de
  privacidad públicas.

## Claves y secretos

| Dato                           | Dónde vive                                          | ¿Es secreto?                       |
| ------------------------------ | --------------------------------------------------- | ---------------------------------- |
| URL del proyecto de Supabase   | `web/src/environments/*.ts`                         | No                                 |
| Publishable key                | `web/src/environments/*.ts`                         | No: está pensada para ir en la web |
| Secret key de Supabase         | Secretos de GitHub (para el scraper)                | **Sí**                             |
| Contraseña de la base de datos | Gestor de contraseñas                               | **Sí**                             |
| Client secret de Google        | Supabase (proveedor Google) y gestor de contraseñas | **Sí**                             |

Los secretos nunca se escriben en el repositorio ni se comparten por chat. Si alguno se
filtra, se regenera en su panel (Supabase o Google Cloud) y se actualiza donde se usa.

## Integración continua

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) se ejecuta en cada push y pull
request: linter, formato, tests y compilación de producción. El resultado se ve en la pestaña
**Actions** de GitHub. [Dependabot](../.github/dependabot.yml) abre pull requests cuando hay
actualizaciones de dependencias.
