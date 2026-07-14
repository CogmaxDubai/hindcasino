// One-shot sitewide sweep:
//   1. Convert every affiliate CTA <a href="/go/…"> to <span data-go="…">
//   2. Reorder the .quick-pick Top 5 rows sitewide to new priority:
//        1 Casino Khajana, 2 Jeet Boost, 3 Masti Spins, 4 Casino Days, 5 Parimatch
//   3. Replace BigBaazi/LuckySpin/PuntIt entries in .quick-pick tables
//      with the new brand rows (keeping the same table structure).
//   4. Update sticky-rail cards + mobile-cta on homepage to Casino Khajana.
//   5. Update ItemList JSON-LD schemas.
const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.claude', 'go'].includes(f.name)) continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p, out);
    else if (f.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk('.');
let ctaCount = 0;
let filesTouched = 0;

for (const f of files) {
  const orig = fs.readFileSync(f, 'utf8');
  let html = orig;

  // ---- 1. Cloak every <a href="/go/…"> as <span data-go="…">
  // Pattern captures: quote, slug, optional `?s=…` (source), class, rel, inner text.
  html = html.replace(
    /<a\s+href="\/go\/([a-z0-9-]+)\/(?:\?s=([^"]+))?"([^>]*?)>([\s\S]*?)<\/a>/gi,
    (m, slug, src, attrs, inner) => {
      ctaCount++;
      // Strip href-oriented attrs (rel), keep class + others
      const classMatch = attrs.match(/class="([^"]*)"/);
      const cls = classMatch ? classMatch[1] : '';
      const others = attrs.replace(/\s*class="[^"]*"/, '').replace(/\s*rel="[^"]*"/, '').trim();
      const dataSrc = src ? ` data-src="${src}"` : '';
      return `<span class="${cls}" data-go="${slug}"${dataSrc} role="button" tabindex="0"${others ? ' ' + others : ''}>${inner}</span>`;
    }
  );

  if (html !== orig) {
    fs.writeFileSync(f, html, 'utf8');
    filesTouched++;
  }
}

console.log('CTA links cloaked:', ctaCount);
console.log('Files updated for cloaking:', filesTouched);
