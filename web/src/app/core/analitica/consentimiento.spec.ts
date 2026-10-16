import { guardarConsentimiento, leerConsentimiento } from './consentimiento';

const AHORA = new Date('2026-10-16T10:00:00Z');

describe('leerConsentimiento', () => {
  it('sin nada guardado, pregunta', () => {
    expect(leerConsentimiento(null, AHORA)).toBe('pendiente');
  });

  it('recuerda lo que se eligió', () => {
    expect(leerConsentimiento(guardarConsentimiento('aceptado', AHORA), AHORA)).toBe('aceptado');
    expect(leerConsentimiento(guardarConsentimiento('rechazado', AHORA), AHORA)).toBe('rechazado');
  });

  it('pasado un año, vuelve a preguntar', () => {
    const haceUnAnio = new Date('2025-10-15T10:00:00Z');
    const haceOnceMeses = new Date('2025-11-16T10:00:00Z');
    expect(leerConsentimiento(guardarConsentimiento('aceptado', haceUnAnio), AHORA)).toBe(
      'pendiente',
    );
    expect(leerConsentimiento(guardarConsentimiento('aceptado', haceOnceMeses), AHORA)).toBe(
      'aceptado',
    );
  });

  it('lo que no entiende cuenta como pendiente', () => {
    expect(leerConsentimiento('aceptado', AHORA)).toBe('pendiente');
    expect(leerConsentimiento('null', AHORA)).toBe('pendiente');
    expect(leerConsentimiento('{"estado":"quizas","fecha":"2026-10-01"}', AHORA)).toBe('pendiente');
    expect(leerConsentimiento('{"estado":"aceptado"}', AHORA)).toBe('pendiente');
    expect(leerConsentimiento('{"estado":"aceptado","fecha":"2030-01-01"}', AHORA)).toBe(
      'pendiente',
    );
  });
});
