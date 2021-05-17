import { readFileSync } from 'fs';

export const privateKey =
  process.env.JWT_PRIVATE_KEY_PEM ?? readFileSync(process.env.JWT_PRIVATE_KEY);
