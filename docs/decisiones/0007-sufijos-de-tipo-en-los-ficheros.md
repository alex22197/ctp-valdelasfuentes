# 0007. Sufijos de tipo en los nombres de fichero

- Estado: Aceptada
- Fecha: 2026-10-08

## Contexto

Desde la versión 20, Angular genera ficheros sin sufijo (`tabla-clasificacion.ts` en lugar de
`tabla-clasificacion.component.ts`). Uno de los objetivos del proyecto es que cualquiera
entienda qué es cada fichero sin abrirlo.

## Decisión

Mantener los sufijos: `.component.ts`, `.service.ts`, `.guard.ts`, `.pipe.ts`, `.mapper.ts`,
`.strategy.ts`, `.interface.ts`, `.type.ts`. `angular.json` está configurado para que
`ng generate` los añada.

## Consecuencias

- Nombres algo más largos, a cambio de que la estructura se lea sola.
