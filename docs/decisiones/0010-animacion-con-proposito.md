# 0010. Animación con propósito

- Estado: Aceptada
- Fecha: 2026-10-09

## Contexto

El diseño inicial era sobrio a propósito: solo la pista llevaba el protagonismo. Usando la web,
Alex la vio demasiado plana, sobre todo en el móvil, que es donde se usa casi siempre, y pidió
que fuera más animada y vistosa. Hay que hacerlo sin caer en efectos de plantilla y sin que la
web se vuelva lenta o incómoda.

## Decisión

- La animación **explica un cambio**: de dónde viene algo y adónde va (la ficha que vuela del
  panel a la pista), qué se ha guardado o qué falla. No hay animaciones solo de adorno.
- **Temática de pádel**: pistas, fichas de jugador, la bola amarilla, marcadores. Siguen
  prohibidos los degradados decorativos y las tarjetas genéricas con sombra.
- **Pensada para el móvil**: paneles que suben desde abajo, objetivos de al menos 44 px y
  respuesta inmediata al tocar.
- **Corta**: entre 150 y 450 ms, con las variables de `_tokens.scss` (`--duracion-*`,
  `--curva-*`). Nada bloquea la interacción mientras se anima.
- **Primero CSS** (transiciones, `@starting-style`, `@keyframes`) y la **View Transitions API**
  del navegador para los movimientos entre sitios. Sin librerías de animación.
- **Se apaga sola**: con «reducir movimiento» activado en el dispositivo no se anima nada, y
  en los navegadores sin soporte el cambio ocurre igual, solo que sin animación.

## Consecuencias

- `docs/diseno.md` cambia el principio de «interfaz sobria»: la pista sigue siendo el elemento
  característico, pero el resto de la interfaz también reacciona y se mueve.
- Cada animación nueva tiene que poder justificarse con uno de estos puntos.
