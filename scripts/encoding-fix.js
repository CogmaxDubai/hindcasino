const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const ARROW = '\u00c3\u00a2\u00e2\u20ac\u00a0\u2019';
const WARN1 = '\u00c3\u00a2\u00c5\u00a1\u00c2\u00a0\ufe0f';
const WARN2 = '\u00c3\u00a2\u00c5\u00a1\u00e2\u20ac\u00a0\ufe0f';
const PLANE = '\u00c3\u00a2\u0153\u2030\u02c6\ufe0f';

const regexReplacements = [
  [new RegExp(ARROW.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '→'],
  [new RegExp(WARN1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '⚠️'],
  [new RegExp(WARN2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '⚠️'],
  [new RegExp(PLANE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '✈️'],
  [/Ãƒ—/g, '×'],
  [/Ã—/g, '×'],
  [/Ã¢Ë†'/g, '−'],
  [/âˆ'/g, '−'],
  [/Ã¢â€šÂ¿/g, '₿'],
  [/⭐â€\s?/g, '⭐'],
  [/LabouchÃ¨re/g, 'Labouchère'],
];

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !['go', 'css', 'js', 'scripts'].includes(e.name)) walk(p, files);
    else if (e.name.endsWith('.html')) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  for (const [re, to] of regexReplacements) c = c.replace(re, to);
  if (c !== orig) {
    fs.writeFileSync(file, c, 'utf8');
    changed++;
    console.log('fixed:', path.relative(root, file));
  }
}
console.log('Total files fixed:', changed);
