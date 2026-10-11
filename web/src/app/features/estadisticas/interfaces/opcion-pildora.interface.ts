/** Una opción de un selector de píldoras. */
export interface OpcionPildora<T> {
  readonly valor: T;
  readonly etiqueta: string;
}
