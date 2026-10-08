# 0001. Supabase como base de datos, API y login, sin servidor propio

- Estado: Aceptada
- Fecha: 2026-10-08

## Contexto

La web necesita una base de datos relacional (jornadas, partidos, parejas, estadísticas),
login para dos o tres gestores y coste cero. El volumen es mínimo: un equipo de ~22 personas.

## Decisión

Usar Supabase: PostgreSQL con API REST generada, autenticación con Google y políticas de
seguridad por fila (RLS). La web habla directamente con Supabase; no hay back propio.

## Consecuencias

- Cero servidores que mantener y coste cero en el plan gratuito (500 MB de base de datos).
- La seguridad depende de que cada tabla tenga RLS y permisos correctos: se revisan en cada
  migración (ver [`docs/base-de-datos.md`](../base-de-datos.md)).
- Las reglas de negocio de la normativa se implementan en PostgreSQL (restricciones y triggers).
- El plan gratuito pausa el proyecto tras 7 días sin actividad; el scraper semanal lo evita.
- Si algún día hace falta lógica de servidor (por ejemplo, avisos), se usarían Edge Functions
  de Supabase sin cambiar la arquitectura.
