// generate-redirects.js
import { appendFile } from 'fs/promises';

// Read the API URL from the environment variable
const apiUrl = process.env.VITE_PUBLIC_API_URL;

if (!apiUrl) {
  console.error("Error: VITE_PUBLIC_API_URL environment variable is not set.");
  process.exit(1);
}

// Define the redirect rule with the API URL included
const redirectsContent = `\n/api/* ${apiUrl}/:splat 200!`;
const redirectsContent2 = `\n/test https://www.example.com/ 200!`;

// Write the redirects content to the _redirects file in the build directory
try {
  await appendFile('build/_redirects', redirectsContent, 'utf8');
  await appendFile('build/_redirects', redirectsContent2, 'utf8');
  console.log("Redirects file generated with API URL:", apiUrl);
} catch (error) {
  console.error("Failed to write redirects file:", error);
  process.exit(1);
}