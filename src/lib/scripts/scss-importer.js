import { readFileSync } from 'fs';
import { resolve } from 'path';

export const jsonImporter = (url) => {
  if (url.endsWith('.json')) {
    const filePath = resolve(process.cwd(), url);
    const jsonContent = JSON.parse(readFileSync(filePath, 'utf8'));

    // Convert JSON keys/values into SCSS variables
    const scssVariables = Object.entries(jsonContent)
      .map(([key, value]) => `$${key}: ${value};`)
      .join('\n');

    return { contents: scssVariables };
  }

  return null;
}