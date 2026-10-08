# Operativa

Qué hay que hacer cada semana de jornada y las tareas de administración puntuales.

> La pantalla de **resultados** ya está en la web. Pasar lista y la convocatoria están en
> desarrollo; mientras tanto, esos datos se editan desde el **Table Editor** de Supabase.

## Meter los resultados de una jornada

1. Entra con tu cuenta de gestor y ve al **Inicio**.
2. En el **Calendario**, pulsa **Meter resultados** en la jornada.
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
| Según van llegando respuestas                  | Gestor     | **Pasa lista** en la web: marca quién puede y quién no.                                                                               |
| Cuando el capitán decide                       | Gestor     | **Convocatoria y alineación**: elige convocados y coloca cada pareja en su pista (revés y drive). Se publica en la portada.           |
| Tras jugar                                     | Gestor     | **Resultados**: marcador set a set de los 6 partidos, o el WO o abandono si lo hubo (ver abajo).                                      |
| Martes antes de las 14:00 (si jugamos en casa) | Capitán    | Envía el acta a la liga. Si no, la normativa resta 1 punto.                                                                           |
| Miércoles por la tarde                         | Automático | El scraper lee la web de la liga y actualiza el calendario, los resultados de todo el grupo y la clasificación oficial _(pendiente)_. |

## Comodines

Jugadores que no son de la plantilla habitual pero cubren huecos (por ejemplo, Jess en la
jornada 1). Están en `plantilla` con `comodin = true`:

- Aparecen en alineaciones y resultados.
- No aparecen en «pasar lista».
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

| Síntoma                                 | Qué mirar                                                                                                              |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| La web dice «No se ha podido cargar…»   | Panel de Supabase: que el proyecto no esté pausado (se pausa tras 7 días sin actividad; se reactiva con un clic).      |
| No deja iniciar sesión                  | Que la cuenta esté en los usuarios de prueba de Google y que la URL de la web esté en las _Redirect URLs_ de Supabase. |
| Inicias sesión pero no puedes gestionar | Que tu usuario tenga fila en `perfil`.                                                                                 |
| La clasificación no se actualiza        | Registro de la tabla `ejecucion_scraper` y la pestaña **Actions** de GitHub _(cuando exista el scraper)_.              |
