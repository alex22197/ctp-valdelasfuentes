# Contexto del proyecto

Todo lo que se sabe del equipo, de las personas y de cómo se trabaja, recogido de las
conversaciones en las que se diseñó el proyecto (octubre de 2026). Léelo antes de proponer
cambios: muchas decisiones dependen de cómo funciona el equipo en la realidad.

## Quién lo usa

- **Autor y administrador**: Alex (cuenta de GitHub `alex22197`). Es **jugador** del equipo,
  no el capitán, pero a veces hace de capitán cuando el titular no puede. Programa
  principalmente en **Angular**; el resto de la tecnología la eligió el asistente.
- **Capitán**: puede tener cuenta de gestor si quiere (pendiente de preguntarle).
- **Resto del equipo**: consulta la web desde el móvil, sin cuenta. Toda la comunicación del
  equipo va por **WhatsApp**, así que los enlaces se compartirán por ahí.
- **Presupuesto: 0 €.** Todo debe funcionar en planes gratuitos.

## El equipo y la liga

- Club: **C.T.P. Alcobendas** (Club de Tenis y Pádel Alcobendas). Valdelasfuentes es un barrio
  de Alcobendas.
- Equipo: **CTPA Valdelasfuentes**, con ese nombre exacto en la web de la liga.
- En proyectos, repositorio y cuentas se usa **CTP Valdelasfuentes** / `ctp-valdelasfuentes`
  (sin la A). Dentro de la base de datos el equipo se llama **CTPA Valdelasfuentes** porque el
  scraper necesita el texto exacto de la liga.
- Competición actual: **Liga MasterPadel**, temporada 2026-27, **4ª División, zona 1**.
  Grupo de 4 equipos: CTPA Valdelasfuentes, Padel Attraction B, Padelgon "C" y Soto Torrejón.
  - Página del grupo: <https://ligamasterpadel.lansoft.es/php/area_grupo.php?id=4>
  - Normativa: <https://ligamasterpadel.lansoft.es/pdf/normativa.pdf> (resumen en
    [`normativa-liga.md`](normativa-liga.md)).
- Solo hay **un equipo** del club inscrito; la web es solo para él.
- En **enero de 2027** el equipo jugará otra competición, la **Liga Dunlop**. No se ha
  encontrado su web ni su normativa: no se sabe si su formato coincide (3 masculinos,
  2 femeninos, 1 mixto). El modelo de datos es genérico precisamente por esto.

## Cómo funciona una jornada en la realidad

1. Una semana antes, el capitán manda una **encuesta por WhatsApp** para saber quién puede ir.
2. Los jugadores **no van a entrar en la web** para responder. Alex (o quien gestione) pasará
   las respuestas a mano a la web. Por eso la pantalla de «pasar lista» tiene que ser muy rápida:
   todos los jugadores en una lista y un toque por persona.
3. El capitán decide la convocatoria y la manda al grupo como una tabla: rival, día, hora,
   «los 6 a la vez» (si hay 6 pistas), y para cada pareja (masculino 1-3, femenino 1-2, mixto)
   los dos nombres. **El de la izquierda juega de revés y el de la derecha de drive.**
4. Si no hay suficientes jugadores, se llama a **comodines**: gente que no es de la plantilla
   habitual. Según la normativa deben estar inscritos oficialmente en el equipo.

### Convocatoria de la jornada 1 (tal como la mandó el capitán)

«vs Soto Torrejón, sábado 12:00, los 6 a la vez» (10 de octubre de 2026, fuera):

| Partido     | Revés         | Drive          |
| ----------- | ------------- | -------------- |
| Masculino 1 | Sergio        | Jorge          |
| Masculino 2 | Álex          | Pablo Cristini |
| Masculino 3 | Álvaro        | Joel           |
| Femenino 1  | Marta Prieto  | Virginia       |
| Femenino 2  | Marta Morales | Jess (comodín) |
| Mixto       | Rocío         | Iván Guadalix  |

Ya está cargada en la migración de datos iniciales. No se conocen las respuestas a la
encuesta del resto ni la sede de Soto Torrejón.

## Plantilla

Nombres para mostrar tal como los pasó Alex. Los nombres completos van en `jugador_privado`
(solo visibles para gestores).

| Chicos                                                                       | Nombre completo conocido |
| ---------------------------------------------------------------------------- | ------------------------ |
| Diego, Sergio, Alex, Juan, Álvaro, Miguel, Jorge, Carlos, Walter, Ivan, Joel | —                        |
| Ivan G                                                                       | Iván Guadalix            |
| Pablo                                                                        | Pablo Cristini           |

| Chicas                       | Nombre completo conocido                        |
| ---------------------------- | ----------------------------------------------- |
| Rocio, Andrea, Raquel, Sofia | —                                               |
| Marta Morales                | Marta Morales                                   |
| Marta Muro                   | Marta Muro                                      |
| Marta Prieto                 | Marta Prieto (antes figuraba solo como «Marta») |
| Vir                          | Virginia                                        |
| Jess                         | Comodín, no es de la plantilla habitual         |

- 13 chicos y 8 chicas habituales (cumple la normativa: mínimo 10 y 6).
- El **lado preferido** de cada uno aún no se ha definido; se puede ir deduciendo de los
  partidos registrados.
- En la base de datos los nombres van como los escribió Alex («Rocio», «Alex»), aunque el
  capitán los escribe con tilde («Rocío», «Álex»). Se pueden corregir cuando se quiera.

## Decisiones de producto

- **Web pública** para consultar; **login con Google** solo para gestionar. Tener cuenta no da
  permisos: el admin asigna el rol en la tabla `perfil`. Ver
  [ADR 0004](decisiones/0004-web-publica-con-gestion-por-invitacion.md).
- **Privacidad**:
  - En lo público se muestra el nombre para mostrar (ya es informal). El nombre completo solo
    lo ven los gestores.
  - Las **respuestas a la encuesta** (quién dijo que no, quién no contestó) son **privadas**:
    solo admin y capitán. La convocatoria final sí es pública.
  - Si algún jugador no quiere aparecer, se podrá mostrar como «Jugador anónimo» en lo público.
  - Antes de publicar la web se avisará al equipo, y habrá una página corta de privacidad con
    Alex como contacto.
- **Comodines**: aparecen en alineaciones y resultados, pero no en «pasar lista» y no tienen
  ficha ni estadísticas propias en lo público. Las estadísticas los muestran separados.
- **WO**: cuentan en la clasificación según la normativa, pero no en el porcentaje de victorias
  de cada jugador; se muestran aparte. Ver
  [ADR 0006](decisiones/0006-wo-fuera-de-estadisticas-individuales.md).
- **Estadísticas**: Alex quiere «todas las posibles», con **gráficas muy vistosas e
  interactivas**. Librería elegida: **Apache ECharts** (`ngx-echarts`).
- **Scraping**: la web de la liga no tiene API. Se hará scraping del HTML (tablas simples)
  una vez por semana, los miércoles por la tarde, después de que venza la validación de actas
  (miércoles 14:00). Se traen calendario, resultados de todo el grupo y clasificación. El
  detalle de los partidos (parejas, sets) no lo publica la liga; se mete a mano solo para
  nuestro equipo. Hay que comprobar si la web publica también las actas o la lista oficial
  de inscritos.

## Preferencias de Alex sobre el código

Recogidas en [`AGENTS.md`](../AGENTS.md). Lo esencial: proyecto muy organizado y bien
componetizado, sin componentes enormes; nombres de fichero descriptivos que entienda alguien
que no hizo el proyecto; **nunca código de un lenguaje dentro de otro** (nada de HTML o CSS en
el TypeScript); interfaces en carpetas `interfaces/`; todo documentado; nivel de «desarrollador
senior de Google», nada de chapuzas.

## Estado de las cuentas y servicios

| Servicio      | Estado                                                                                                                                                                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub        | Repositorio privado `alex22197/ctp-valdelasfuentes`.                                                                                                                                                                                                                                                          |
| Supabase      | Proyecto `ctp-valdelasfuentes`, ref `wqnelcngcnubwtymnmjk`, región eu-west-1 (Irlanda), plan gratuito. Creado con «Automatically expose new tables» **desactivado** y «automatic RLS» **activado**. Migraciones aplicadas.                                                                                    |
| Google Cloud  | Proyecto **CTP Valdelasfuentes** con cliente OAuth «Supabase» (aplicación web). Pantalla de consentimiento en **modo prueba**: solo entran los usuarios de prueba. Dominio autorizado: `wqnelcngcnubwtymnmjk.supabase.co`. No se pudo publicar porque Google exige página principal y política de privacidad. |
| Supabase Auth | Proveedor Google activado con el cliente anterior. Falta configurar las URLs (ver [hoja de ruta](hoja-de-ruta.md)).                                                                                                                                                                                           |
| Cloudflare    | Cuenta creada; la web aún no está desplegada.                                                                                                                                                                                                                                                                 |

## Diseño

Bocetos y sistema visual en [`diseno.md`](diseno.md).
