import { readFileSync } from 'fs';

export const publicKey =
  process.env.JWT_PUBLIC_KEY_PEM ?? readFileSync(process.env.JWT_PUBLIC_KEY);
