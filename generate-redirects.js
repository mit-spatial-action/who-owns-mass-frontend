// generate-redirects.js
import 'fs';

// Read the API URL from the environment variable
const apiUrl = process.env.VITE_PUBLIC_API_URL;

if (!apiUrl) {
  console.error("Error: VITE_PUBLIC_API_URL environment variable is not set.");
  process.exit(1);
}

// Define the redirect rule with the API URL included
const redirectsContent = `/api/* ${apiUrl}/:splat 200`;

// Write the redirects content to the _redirects file in the build directory
fs.writeFileSync('build/_redirects', redirectsContent, 'utf8');
console.log("Redirects file generated with API URL:", apiUrl);