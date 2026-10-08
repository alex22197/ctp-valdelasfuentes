/**
 * Comprobaciones que se ejecutan sobre los ficheros de web/ en cada commit.
 * Las herramientas viven en web/node_modules, así que se lanzan con `npm --prefix web exec`.
 */
const conComillas = (archivos) => archivos.map((archivo) => `"${archivo}"`).join(' ');
const enWeb = (comando) => `npm --prefix web exec -- ${comando}`;

export default {
  '*.{ts,html}': (archivos) => [
    enWeb(`eslint --fix --max-warnings=0 --no-warn-ignored ${conComillas(archivos)}`),
    enWeb(`prettier --write ${conComillas(archivos)}`),
  ],
  '*.{scss,json,jsonc,md}': (archivos) => enWeb(`prettier --write ${conComillas(archivos)}`),
};
