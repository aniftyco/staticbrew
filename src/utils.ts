import { readFileSync } from 'fs';
import { resolve } from 'path';

export const getPkgJson = () => {
  const path = resolve(__dirname, '../package.json');
  const pkg = readFileSync(path, 'utf-8');

  return JSON.parse(pkg);
};
