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
4. Guarda y despliega. La web queda en
   `https://ctp-valdelasfuentes.padel-ctp.workers.dev`.

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

| Campo         | Valor                                                                               |
| ------------- | ----------------------------------------------------------------------------------- |
| Site URL      | `https://ctp-valdelasfuentes.padel-ctp.workers.dev`                                 |
| Redirect URLs | `https://ctp-valdelasfuentes.padel-ctp.workers.dev/**` y `http://localhost:4200/**` |

Sin esto, después de iniciar sesión con Google Supabase no sabría a qué web devolverte.

## Google (login)

- Las credenciales OAuth están en Google Cloud Console, proyecto **CTP Valdelasfuentes**.
- La app está **publicada** (en producción desde el 16 de octubre de 2026): puede entrar cualquier cuenta de Google, pero solo quien tiene fila en `perfil`
  ve la gestión: el resto ve la web como un visitante. Como solo pide correo, nombre y foto
  (permisos básicos), Google no la revisa.

### Publicar la app de Google

Hace falta que la página de privacidad ya esté en la web publicada.

1. En Google Cloud Console, proyecto **CTP Valdelasfuentes**, ve a **Google Auth Platform** →
   **Marca** (_Branding_) y rellena:
   - Página principal: `https://ctp-valdelasfuentes.padel-ctp.workers.dev`
   - Política de privacidad: `https://ctp-valdelasfuentes.padel-ctp.workers.dev/privacidad`
   - Dominios autorizados: `padel-ctp.workers.dev` y el de Supabase
     (`wqnelcngcnubwtymnmjk.supabase.co`), si no están ya.
2. Mejor sin logotipo: con logotipo Google pide verificar la marca y tarda días.
3. En **Público** (_Audience_), pulsa **Publicar app** y confirma.
4. Prueba a entrar con una cuenta de Google que no esté entre los usuarios de prueba: debe
   entrar y ver la web como un visitante.

## Cabeceras de seguridad

`web/public/_headers` se copia a la web compilada y Cloudflare lo aplica a cada respuesta:

- **Política de contenido (CSP):** solo se cargan scripts de la propia web y de Google Analytics
  (`*.googletagmanager.com`); estilos de la web y de Google Fonts; letras de Google Fonts;
  imágenes propias, `blob:` (la imagen de la convocatoria), `data:` y las de Google Analytics;
  y solo se habla con la propia web, con Supabase y con Google Analytics
  (`*.google-analytics.com`, `*.analytics.google.com`, `*.googletagmanager.com`; con
  comodín porque Google manda las visitas a servidores de cada región). No se puede meter la
  web en un marco de otra (`frame-ancestors 'none'`).
- **Cualquier servicio externo nuevo** (otra fuente, un mapa incrustado…) hay que añadirlo a la
  política, o el navegador lo bloqueará sin avisar.
- Para que no haga falta `'unsafe-inline'` en los scripts, `angular.json` desactiva
  `inlineCritical` en producción (Angular metía un script pequeño en `index.html`).
- Los `.js` y `.css` llevan una huella en el nombre, así que se guardan un año en el navegador;
  `index.html` se revalida en cada visita.
- Para comprobarlo tras publicar: `curl -sI https://ctp-valdelasfuentes.padel-ctp.workers.dev/`.

## Google Analytics

La web mide las visitas con Google Analytics 4 (propiedad «Web CTPA Valdelasfuentes», en la
cuenta de Alex), solo si el visitante lo acepta en el aviso de cookies:

- El ID de medición (`G-…`) está en `web/src/environments/environment.ts`. No es secreto: va
  en cualquier web que use Analytics. En local es `null` y no se mide nada.
- Hasta que se acepta no se carga nada de Google. El código está en `core/analitica`: carga
  `gtag.js` al aceptar y cuenta una visita por cada página. Las direcciones (la de la página y
  la de procedencia) van sin `?…` ni `#…`, que al entrar con Google llevan el código de
  acceso. Al rechazar, pone el interruptor de Google `ga-disable-<ID>`, para que no salga
  nada, y borra las cookies `_ga`.
- Las visitas las cuenta la web, así que en Analytics, en **Administrar → Flujos de datos →
  Web → Medición mejorada**, está desactivado **«Cambios de página basados en eventos del
  historial del navegador»**: si no, cada página contaría dos veces.
- Publicidad y Google Signals, desactivados. Si se cambia algo de esto, hay que actualizar la
  página de privacidad.

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
