import { esUuid } from './es-uuid';

describe('esUuid', () => {
  it('acepta un identificador en minúsculas o mayúsculas', () => {
    expect(esUuid('0f8fad5b-d9cb-469f-a165-70867728950e')).toBe(true);
    expect(esUuid('0F8FAD5B-D9CB-469F-A165-70867728950E')).toBe(true);
  });

  it('rechaza textos que no lo son', () => {
    expect(esUuid('abc')).toBe(false);
    expect(esUuid('')).toBe(false);
    expect(esUuid('0f8fad5b-d9cb-469f-a165-70867728950e ')).toBe(false);
  });
});
