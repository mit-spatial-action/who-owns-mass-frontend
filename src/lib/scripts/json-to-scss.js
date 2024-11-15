import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const inputPath = resolve(process.cwd(), 'src/lib/config/styles.json');
const outputPath = resolve(process.cwd(), 'src/lib/styles/vars.scss');

const json = JSON.parse(readFileSync(inputPath, 'utf8'));

const scssContent = Object.entries(json)
  .map(([key, value]) => `$${key}: ${value};`)
  .join('\n');

writeFileSync(outputPath, scssContent);