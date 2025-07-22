// generate-redirects.js
import { readFileSync, writeFileSync } from 'fs';

// Read the API URL from the environment variable
const apiUrl = process.env.VITE_PUBLIC_API_URL;

if (!apiUrl) {
  console.error("Error: VITE_PUBLIC_API_URL environment variable is not set.");
  process.exit(1);
}

// Define the redirect rule with the API URL included
const redirectsContent = `/api/* ${apiUrl}/:splat 200!\n`;

// Write the redirects content to the _redirects file in the build directory
try {
  const contents = await readFileSync('build/_redirects', 'utf8');
  const newContents = redirectsContent + contents;
  await writeFileSync('build/_redirects', newContents)
} catch (error) {
  process.exit(1);
}