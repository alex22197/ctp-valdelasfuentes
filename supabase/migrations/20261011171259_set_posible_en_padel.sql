-- =====================================================================
-- CTPA Valdelasfuentes - Sets imposibles rechazados por la propia tabla (#42)
-- guardar_resultado_partido ya valida el marcador entero (validar_marcador), pero la tabla
-- solo exigía juegos de 0 a 7. Estas restricciones impiden guardar un set imposible en el
-- pádel aunque no se use la web. Un set a medias (abandono o suspendido) sigue valiendo.
-- =====================================================================

-- A 7 juegos solo se llega con 7-5 o 7-6: un 7-2 o un 7-7 no existen.
alter table public.set_partido
  add constraint set_posible check (
    greatest(juegos_nuestros, juegos_rival) < 7
    or least(juegos_nuestros, juegos_rival) in (5, 6)
  );

-- El tie-break se gana a 7 puntos con 2 de diferencia (7-0 a 7-5, o 8-6, 9-7…) y lo gana la
-- pareja que gana el set. (Que solo haya tie-break en un 7-6 ya lo comprueba
-- tiebreak_solo_en_7_6.)
alter table public.set_partido
  add constraint tiebreak_posible check (
    tiebreak_nuestros is null
    or (
      (
        (greatest(tiebreak_nuestros, tiebreak_rival) = 7
          and least(tiebreak_nuestros, tiebreak_rival) <= 5)
        or (greatest(tiebreak_nuestros, tiebreak_rival) > 7
          and abs(tiebreak_nuestros - tiebreak_rival) = 2)
      )
      and (tiebreak_nuestros > tiebreak_rival) = (juegos_nuestros > juegos_rival)
    )
  );
