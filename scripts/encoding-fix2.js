const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const fixes = [
  ['Ã·', '÷'],
  ['—œ', '–'],
  ['Ã¢Å“Ë†️', '✈️'],
  ['Ã¢Å¡â€️', '⚠️'],
  ['Ã¢â€šÂ¿', '₿'],
];

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !['go', 'css', 'js', 'scripts'].includes(e.name)) walk(p, files);
    else if (e.name.endsWith('.html')) files.push(p);
  }
  return files;
}

for (const file of walk(root)) {
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  for (const [from, to] of fixes) c = c.split(from).join(to);
  if (c !== orig) fs.writeFileSync(file, c, 'utf8');
}
console.log('done');
