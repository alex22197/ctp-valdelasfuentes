# 0004. Web pública y gestión por invitación

- Estado: Aceptada
- Fecha: 2026-10-08

## Contexto

El equipo quiere que cualquiera pueda ver la web, pero no que todos puedan modificarla. La
realidad es que la encuesta de disponibilidad seguirá haciéndose por WhatsApp y que los
jugadores no van a entrar a la web a responder.

## Decisión

- La web es pública y no requiere cuenta para consultar.
- Solo los gestores (administrador y capitán) inician sesión, con Google.
- Tener cuenta no da permisos: el administrador asigna el rol en la tabla `perfil`.
- Los datos sensibles (nombre completo y respuestas a la encuesta) solo los ven los gestores.

## Consecuencias

- Las pantallas de gestión están pensadas para que un gestor pase los datos de WhatsApp
  rápido, no para que cada jugador los introduzca.
- Si en el futuro los jugadores quisieran marcar su disponibilidad, el modelo lo permite
  añadiendo un rol `jugador`.
