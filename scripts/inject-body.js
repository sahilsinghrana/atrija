import { readFileSync, writeFileSync } from 'fs';

const htmlPath = 'dist/index.html';
let html = readFileSync(htmlPath, 'utf8');

// Astro 4.16.19 strips <body> tags during static generation.
// Inject them after </head> and before </html>.
// This is NOT a temp fix — it's the only way to produce valid HTML with this Astro version.

if (!html.includes('<body')) {
  html = html.replace('</head>', '</head><body>');
  if (!html.includes('</body>')) {
    html = html.replace('</html>', '</body></html>');
  }
  writeFileSync(htmlPath, html);
  console.log('✓ Injected <body> tags into dist/index.html');
} else {
  console.log('✓ <body> tag already present, no injection needed');
}
