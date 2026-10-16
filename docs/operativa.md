# Operativa

Qué hay que hacer cada semana de jornada y las tareas de administración puntuales.

> La **convocatoria** y los **resultados** ya están en la web. La encuesta de quién puede ir se
> hace en WhatsApp y no se pasa a la web. La plantilla aún se
> edita desde el **Table Editor** de Supabase.

## Poner la fecha, la hora y la sede

1. Entra con tu cuenta de gestor y pulsa **Gestión**. En la **Próxima jornada**, pulsa **Poner
   fecha, hora y sede** (también está en la cabecera de la **Convocatoria**).
2. Escribe el día y la hora (la de aquí, aunque el móvil esté en otro huso), la sede y cuántas
   pistas hay. En la sede puedes pegar el enlace de Google Maps (Compartir → Copiar enlace): la
   portada enseñará el nombre del sitio, la dirección y «Cómo llegar». Lo que no sepas, déjalo vacío y quedará «por confirmar».
3. Pulsa **Guardar**. La portada, el calendario y la imagen de la convocatoria lo muestran al
   momento; con menos de 6 pistas, la imagen dice «EN 3 PISTAS» y ordena las parejas por turno.

## Hacer la convocatoria

1. Entra con tu cuenta de gestor, pulsa **Gestión** arriba a la derecha y, en la **Próxima
   jornada**, pulsa **Convocatoria**. También está en el **Calendario** del **Inicio**.
2. Toca cada lado de la pista para elegir quién juega de **revés** (izquierda) y de **drive**
   (derecha). En el panel sale la plantilla y, aparte, los comodines; puedes buscar por nombre. Si eliges a alguien que ya está en
   otra pista, se mueve y deja ese hueco libre.
3. Revisa la **comprobación de normativa**: los errores (alguien en dos pistas, un chico en un
   partido femenino…) impiden guardar; los avisos (huecos sin cubrir, un comodín sin inscribir)
   no.
4. Pulsa **Guardar alineación**. Los colocados quedan convocados; quien quitas, deja de estarlo.
5. Pulsa **Publicar en la portada** cuando sea definitiva. Mientras es un borrador, la portada
   dice que la convocatoria todavía no está publicada.
6. **Copiar para WhatsApp** copia una imagen con la tabla de la convocatoria para pegarla en el
   grupo. Solo se puede con todas las parejas puestas y guardadas. Si el móvil no deja copiar
   imágenes, usa **Compartir** (elige WhatsApp) o **Descargar**, o mantén pulsada la imagen.
   Los nombres completos salen de la plantilla: si alguien sale con su nombre corto, falta
   ponerle el nombre completo.

Si cambias una convocatoria ya publicada, se ve en la portada en cuanto la guardas.

## Meter los resultados de una jornada

1. Entra con tu cuenta de gestor y pulsa **Gestión** arriba a la derecha.
2. En **Resultados por meter** (o en **Todas las jornadas**), pulsa **Meter resultados** en la
   jornada. También está en el **Calendario** del **Inicio**.
3. En cada partido elige cómo terminó (Jugado, WO a favor, WO en contra, Abandono o
   Suspendido), escribe los juegos de cada set (y el tie-break si un set acaba 7-6) y pulsa
   **Guardar**. Cada partido se guarda por separado.
4. Cuando los seis tienen resultado, la jornada pasa a «jugada», el marcador aparece en el
   calendario y la portada muestra el siguiente partido.

Si la web rechaza un marcador, el mensaje explica qué regla de la normativa no cumple. En un
WO en contra se quita la pareja del partido, porque no jugó nadie.

## Semana de jornada

| Cuándo                                         | Quién      | Qué                                                                                                                                   |
| ---------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Lunes o martes, una semana antes               | Capitán    | Manda la encuesta de disponibilidad por WhatsApp.                                                                                     |
| Según van llegando respuestas                  | Capitán    | Las recoge en el propio WhatsApp: la web no tiene encuesta ([ADR 0012](decisiones/0012-sin-encuesta-en-la-web.md)).                   |
| Cuando el capitán decide                       | Gestor     | **Convocatoria y alineación**: elige convocados y coloca cada pareja en su pista (revés y drive). Se publica en la portada.           |
| Tras jugar                                     | Gestor     | **Resultados**: marcador set a set de los 6 partidos, o el WO o abandono si lo hubo (ver abajo).                                      |
| Martes antes de las 14:00 (si jugamos en casa) | Capitán    | Envía el acta a la liga. Si no, la normativa resta 1 punto.                                                                           |
| Miércoles por la tarde                         | Automático | El scraper lee la web de la liga y actualiza el calendario, los resultados de todo el grupo y la clasificación oficial _(pendiente)_. |

## Comodines

Jugadores que no son de la plantilla habitual pero cubren huecos (por ejemplo, Jess en la
jornada 1). Están en `plantilla` con `comodin = true`:

- Aparecen en alineaciones y resultados.
- Al convocar salen aparte, después de la plantilla.
- Según la normativa, deben estar **inscritos oficialmente** en el equipo. Antes de convocar
  a un comodín nuevo, comprueba que lo está; si no, se pierde el partido si el rival lo
  reclama.

## Dar permisos de gestión

1. La persona entra en la web, pulsa **Entrar** y inicia sesión con Google. Su cuenta debe
   estar añadida como usuario de prueba en Google Cloud (ver [despliegue](despliegue.md)).
2. En Supabase, abre **SQL Editor** y ejecuta, cambiando el correo y el rol:

   ```sql
   insert into public.perfil (user_id, rol)
   select id, 'capitan' from auth.users where email = 'correo@gmail.com';
   ```

   Para el primer administrador, usa `'admin'` con tu propio correo.

3. La persona recarga la web. En «Tu cuenta» verá sus permisos.

Para retirar los permisos:

```sql
delete from public.perfil
where user_id = (select id from auth.users where email = 'correo@gmail.com');
```

## Cambio de fase

Cuando acaba la apertura y empiezan los retos o la clausura:

1. Crear la fase nueva en `fase` con su `orden`, su `inicio` y la `url_grupo` del grupo
   nuevo (puede cambiar si se sube o se baja).
2. La portada pasa a mostrarla automáticamente a partir de su fecha de inicio.

Se hará desde la web cuando exista la pantalla de administración.

## Si algo falla

| Síntoma                                 | Qué mirar                                                                                                                   |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| La web dice «No se ha podido cargar…»   | Panel de Supabase: que el proyecto no esté pausado (se pausa tras 7 días sin actividad; se reactiva con un clic).           |
| No deja iniciar sesión                  | Que la URL de la web esté en las _Redirect URLs_ de Supabase. Si entra pero no ve «Gestión», le falta el permiso de gestor. |
| Inicias sesión pero no puedes gestionar | Que tu usuario tenga fila en `perfil`.                                                                                      |
| La clasificación no se actualiza        | Registro de la tabla `ejecucion_scraper` y la pestaña **Actions** de GitHub _(cuando exista el scraper)_.                   |
