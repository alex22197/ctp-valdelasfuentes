# Arquitectura

## Visión general

```
 Navegador ──► Cloudflare (ficheros estáticos de Angular)
     │
     └──────► Supabase
                ├─ API REST generada sobre PostgreSQL (lecturas y escrituras)
                ├─ Auth (login con Google)
                └─ PostgreSQL con RLS: decide qué puede leer o escribir cada uno

 GitHub Actions (semanal) ──► web de la liga ──► Supabase   (scraper, pendiente)
```

No hay servidor propio. La web es una aplicación de una sola página que habla directamente
con Supabase usando la _publishable key_, que es pública. La seguridad está en la base de
datos: las políticas RLS impiden que un visitante lea datos privados o escriba nada.

## Carpetas de `web/src/app`

```
core/
  config/           Token de entorno y constantes del sitio
  supabase/         Cliente único de Supabase, errores de acceso a datos, tipos generados
  auth/             Sesión, rol del usuario y guard de gestores
  routing/          Estrategia de títulos de página
  layout/           Cabecera, navegación inferior y enlaces del menú
data-access/
  <entidad>/        <entidad>.service.ts   consultas a Supabase
                    <entidad>.mapper.ts    filas de la BD → interfaces de dominio
                    interfaces/            modelos de dominio
                    *.ts                   lógica pura del dominio (con su .spec.ts)
shared/
  components/       Componentes visuales reutilizables (icono, tabla, pista…)
  pipes/            Transformaciones para plantillas
  services/         Servicios del navegador sin datos del equipo (portapapeles)
  utils/            Funciones puras (fechas, etiquetas)
features/
  <seccion>/
    pages/          Componentes enrutables: obtienen datos y componen la página
    components/     Componentes visuales propios de la sección
    services/       Orquestación de datos de la sección
    interfaces/     Tipos propios de la sección
```

### Reglas de dependencia

```
features ──► shared ──► data-access ──► core
    └──────────────────────┘
```

- `features` puede usar `shared`, `data-access` y `core`, pero no otras features.
- `shared` no conoce ninguna feature.
- Solo `data-access` y `core` importan Supabase (ESLint lo impide en el resto).
- Si dos features necesitan lo mismo, se sube a `shared` o a `data-access`.

## Flujo de datos

Ejemplo de la portada:

```
InicioPageComponent
  └─ DatosInicioService (provisto en la página, vive con ella)
       ├─ resource: CompeticionesService.obtenerFaseActual()
       ├─ resource: ClasificacionService.obtenerClasificacion(fase)   ← depende de la fase
       ├─ resource: ConfrontacionesService.obtenerCalendario…(fase)  ← depende de la fase
       ├─ computed: elegirProximaConfrontacion(calendario)
       └─ resource: AlineacionesService.obtenerAlineacion(próxima)   ← depende de la próxima
```

- Los datos se cargan con `resource()`: cada uno expone `isLoading()`, `error()` y su valor,
  y se recarga solo cuando cambian sus parámetros.
- Las plantillas muestran un `ctp-mensaje-estado` mientras cargan, si fallan o si no hay datos.
  Mientras cargan, se ve un esqueleto con la forma de lo que va a salir (`esqueleto="tabla"`,
  `"jugadores"`, `"grafica"`…) y el texto solo lo oyen los lectores de pantalla; si la espera
  se alarga, Libra sale en una ventana delante del contenido.
- Los componentes visuales reciben datos de dominio por `input()` y no saben de dónde vienen.

## Modelo de dominio frente a base de datos

La base de datos usa `snake_case` (`fecha_prevista`); el dominio usa `camelCase`
(`fechaPrevista`). La traducción ocurre solo en los mapeadores. Si cambia una columna:

1. Nueva migración.
2. `npm run db:tipos` regenera `database.types.ts`.
3. TypeScript señala los mapeadores afectados; el resto de la app no se entera.

## Sesión y permisos

- `AuthService` guarda la sesión de Supabase y lee el rol de la tabla `perfil`.
- `esGestor()` y `esAdmin()` solo adaptan la interfaz (mostrar u ocultar botones).
- `gestorGuard` lleva a `/acceso` a quien entra en una página de gestión sin permisos.
- Lo que de verdad protege los datos son las políticas RLS: aunque alguien manipulase la web,
  la base de datos rechazaría la operación.

## Diseño

- Sistema de diseño en `web/src/styles/_tokens.scss`: verdes del escudo y la pista de pádel,
  tipografía Archivo (con su eje de anchura para los textos tipo marcador) y escalas de
  espacio y radio.
- Elemento característico: la pista. El próximo partido se dibuja sobre el césped con la red
  separando a los equipos, y cada pareja de la alineación sobre su media pista
  (revés a la izquierda, drive a la derecha).
- Diseño pensado primero para móvil, con navegación inferior; en escritorio el menú pasa a la
  cabecera.
