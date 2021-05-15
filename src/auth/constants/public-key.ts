import { readFileSync } from 'fs';

export const publicKey = readFileSync(process.env.JWT_PUBLIC_KEY);
