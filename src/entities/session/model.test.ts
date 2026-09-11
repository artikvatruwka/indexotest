import { personalCodeSchema, validatePersonalCode } from './model';

const EXPECTED = '010203-12345';

describe('personalCodeSchema', () => {
  it.each(['010203-12345', '01020312345', '  010203-12345  ', ' 01020312345 '])(
    'accepts %p',
    (input) => {
      expect(personalCodeSchema.safeParse(input).success).toBe(true);
    },
  );

  it.each([
    '',
    '12345',
    '1234567890',
    '010203-1234',
    '010203-123456',
    '010203-abcde',
    'hello',
    '010203 12345',
    '010203/12345',
    '010203-1234A',
    '010203-12345-',
  ])('rejects %p', (input) => {
    expect(personalCodeSchema.safeParse(input).success).toBe(false);
  });

  it('rejects non-ascii digits', () => {
    expect(personalCodeSchema.safeParse('٠١٠٢٠٣-١٢٣٤٥').success).toBe(false);
  });
});

describe('validatePersonalCode', () => {
  it('accepts the exact expected code', () => {
    expect(validatePersonalCode(EXPECTED, EXPECTED)).toBe(true);
  });

  it('accepts the expected code without the dash', () => {
    expect(validatePersonalCode('01020312345', EXPECTED)).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    expect(validatePersonalCode('  010203-12345  ', EXPECTED)).toBe(true);
  });

  it.each(['', '12345', '1234567890', '010203-1234', '010203-123456'])(
    'rejects a malformed input %p',
    (input) => {
      expect(validatePersonalCode(input, EXPECTED)).toBe(false);
    },
  );

  it('rejects non-digit characters', () => {
    expect(validatePersonalCode('010203-abcde', EXPECTED)).toBe(false);
    expect(validatePersonalCode('hello', EXPECTED)).toBe(false);
  });

  it('rejects a well-formed but unknown code', () => {
    expect(validatePersonalCode('999999-99999', EXPECTED)).toBe(false);
  });
});
