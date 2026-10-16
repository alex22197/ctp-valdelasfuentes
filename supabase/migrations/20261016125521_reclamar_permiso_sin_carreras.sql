-- =====================================================================
-- CTPA Valdelasfuentes - reclamar_permiso_gestor() sin carreras
-- Al entrar por primera vez, la web puede comprobar la invitación dos veces
-- casi a la vez. La segunda espera a que la primera borre la invitación y
-- cree el perfil, y después no encuentra nada que reclamar: devolvía NULL y
-- el gestor recién invitado se veía como visitante. Ahora, si la invitación
-- ya no está, se vuelve a leer el perfil.
-- =====================================================================

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
    -- Otra llamada a la vez ya la ha reclamado: su perfil ya está creado.
    select p.rol into v_rol from public.perfil p where p.user_id = v_usuario;
    return v_rol;
  end if;

  insert into public.perfil (user_id, rol) values (v_usuario, v_rol)
  on conflict (user_id) do nothing;
  return v_rol;
end;
$$;

revoke execute on function public.reclamar_permiso_gestor() from public, anon;
grant execute on function public.reclamar_permiso_gestor() to authenticated, service_role;
