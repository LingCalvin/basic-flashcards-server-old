import { readFileSync } from 'fs';

export const privateKey = readFileSync(process.env.JWT_PRIVATE_KEY);
