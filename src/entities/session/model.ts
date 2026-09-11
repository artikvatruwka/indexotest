import { z } from 'zod';

export const PERSONAL_CODE_LENGTH = 11;

export const personalCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}-?\d{5}$/);

export function validatePersonalCode(input: string, expected: string): boolean {
  const parsed = personalCodeSchema.safeParse(input);
  if (!parsed.success) {
    return false;
  }
  return parsed.data.replace('-', '') === expected.replace('-', '');
}
