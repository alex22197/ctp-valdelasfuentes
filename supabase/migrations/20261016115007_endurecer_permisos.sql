-- =====================================================================
-- CTPA Valdelasfuentes - Endurecer permisos (revisión de seguridad, oct. 2026)
-- 1. Las invitaciones de gestor solo las reclama la identidad de Google cuyo
--    correo verificado es el invitado (no basta con el correo de la cuenta).
-- 2. La estructura de la temporada (competición, fases, equipos, clasificación
--    oficial) solo la cambia el administrador; borrar jornadas o jugadores,
--    también. Un capitán sigue pudiendo hacer convocatorias, resultados y
--    poner fecha y sede. Aún no hay copias de seguridad.
-- 3. Las alineaciones en borrador solo las ven los gestores: el resto ve las
--    publicadas y las de partidos ya jugados (las estadísticas solo usan esas).
-- 4. Los nombres de jugadores y equipos no admiten < ni >.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Invitaciones ligadas al correo verificado de Google
-- ---------------------------------------------------------------------

create or replace function public.usuario_google_con_correo(p_email text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select u.id
  from auth.users u
  join auth.identities i on i.user_id = u.id
  where i.provider = 'google'
    and lower(i.identity_data ->> 'email') = lower(btrim(p_email))
    and coalesce((i.identity_data ->> 'email_verified')::boolean, false)
    and lower(u.email) = lower(btrim(p_email))
  limit 1;
$$;

revoke execute on function public.usuario_google_con_correo(text) from public, anon, authenticated;

create or replace function public.reclamar_permiso_gestor()
returns public.rol_usuario
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_usuario uuid := auth.uid();
  v_email   text;
  v_rol     public.rol_usuario;
begin
  if v_usuario is null then
    return null;
  end if;

  select p.rol into v_rol from public.perfil p where p.user_id = v_usuario;
  if v_rol is not null then
    return v_rol;
  end if;

  -- El correo que Google ha verificado para esta cuenta, no el que la cuenta diga tener.
  select lower(i.identity_data ->> 'email') into v_email
  from auth.users u
  join auth.identities i on i.user_id = u.id
  where u.id = v_usuario
    and i.provider = 'google'
    and coalesce((i.identity_data ->> 'email_verified')::boolean, false)
    and lower(u.email) = lower(i.identity_data ->> 'email')
  limit 1;
  if v_email is null then
    return null;
  end if;

  delete from public.invitacion_gestor i where i.email = v_email returning i.rol into v_rol;
  if v_rol is null then
    return null;
  end if;

  insert into public.perfil (user_id, rol) values (v_usuario, v_rol);
  return v_rol;
end;
$$;


-- ---------------------------------------------------------------------
-- 2. La estructura de la temporada, solo el administrador
-- ---------------------------------------------------------------------

do $$
declare
  t text;
begin
  -- Competición, fases, equipos y clasificación oficial: crear, cambiar y borrar.
  foreach t in array array['competicion', 'fase', 'equipo', 'fase_equipo'] loop
    execute format('drop policy "gestores insertan" on public.%I', t);
    execute format('drop policy "gestores modifican" on public.%I', t);
    execute format('drop policy "gestores borran" on public.%I', t);
    execute format(
      'create policy "admin inserta" on public.%I for insert to authenticated with check ((select public.es_admin()))', t);
    execute format(
      'create policy "admin modifica" on public.%I for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()))', t);
    execute format(
      'create policy "admin borra" on public.%I for delete to authenticated using ((select public.es_admin()))', t);
  end loop;

  -- Jornadas y jugadores: los gestores los crean y cambian, pero borrarlos (que se lleva en
  -- cascada partidos, sets y participaciones) solo el administrador.
  foreach t in array array['confrontacion', 'jugador'] loop
    execute format('drop policy "gestores borran" on public.%I', t);
    execute format(
      'create policy "admin borra" on public.%I for delete to authenticated using ((select public.es_admin()))', t);
  end loop;
end;
$$;


-- ---------------------------------------------------------------------
-- 3. Alineaciones en borrador, solo para gestores
-- ---------------------------------------------------------------------

drop policy "lectura publica" on public.participacion;

-- Cualquiera: lo de convocatorias publicadas y lo de partidos que ya tienen resultado.
create policy "lectura de lo publicado" on public.participacion
  for select to anon, authenticated
  using (
    exists (
      select 1
      from public.partido p
      join public.confrontacion c on c.id = p.confrontacion_id
      where p.id = participacion.partido_id
        and (c.convocatoria_publicada or p.resultado is not null)
    )
  );

-- Los gestores, todo (también los borradores que están preparando).
create policy "gestores leen todo" on public.participacion
  for select to authenticated
  using ((select public.es_gestor()));


-- ---------------------------------------------------------------------
-- 4. Nombres en texto plano
-- Los nombres de jugadores y equipos salen en las gráficas; sin < ni > no
-- pueden colar HTML aunque algún día se pinten sin escapar. Las comillas sí
-- valen («Padelgon "C"»).
-- ---------------------------------------------------------------------

alter table public.jugador
  add constraint nombre_mostrar_texto_plano check (nombre_mostrar !~ '[<>]');

alter table public.equipo
  add constraint nombre_texto_plano check (nombre !~ '[<>]');
