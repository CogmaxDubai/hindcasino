const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const encodingFixes = [
  ['Ã¢â€\u0090\u0092', '→'],
  ['Ã¢â€\u0090\u0093', '→'],
  ['Ã¢â€ ', '→'],
  ['Ã¢â€\u0099', '→'],
  ['Ã¢Ë†\u0092', '−'],
  ['Ã¢â€šÂ¿', '₿'],
  ['Ãƒ—', '×'],
  ['Ã¢Å¡â€\u008d', '⚠️'],
  ['Ã¢Å¡Â \u00adï¸\u008f', '⚠️'],
  ['Ã¢Å¡Â ï¸\u008f', '⚠️'],
  ['Ã¢Å"Ë†\u008f', '✈️'],
  ['⭐â€\u00a0', '⭐'],
  ['⭐â€ ', '⭐'],
];

const metaFixes = {
  'index.html': 'HindCasino lists verified online casinos for Indian players in 2026. Compare 5 licensed operators with UPI, live Teen Patti, fast withdrawals, and Indian payment methods.',
  'games/teen-patti/index.html': 'Teen Patti online guide for India 2026. Rules, live vs RNG, best casinos, UPI deposits, and where Teen Patti pays real money.',
  'games/andar-bahar/index.html': 'Andar Bahar online guide for India 2026. Rules, live dealers, best casinos, UPI deposits, and where Andar Bahar pays real money.',
  'games/slots/index.html': 'Online slots guide for Indian players 2026. RTP, providers (Pragmatic, NetEnt, Hacksaw), where to play, and best slot casinos in India.',
  'casinos/luckyspin-review/index.html': 'LuckySpin casino listing 2026. 4,500+ slots, daily tournaments, low ₹200 min deposit, crypto support, and provably-fair games for Indian players.',
  'bonuses/welcome-bonus/index.html': 'Welcome bonus guide for Indian online casinos 2026. Match offers, wagering terms, bonus calculator, and the fine print explained.',
  'bonuses/free-spins/index.html': 'Free spins bonuses at Indian online casinos 2026. No-deposit vs deposit spins, wagering rules, and which operators offer the most free spins.',
  'comparisons/parimatch-vs-puntit/index.html': 'Parimatch vs PuntIt head-to-head 2026. Bonuses, UPI, cricket betting, game library, and which is better for Indian players.',
  'comparisons/index.html': 'Casino comparison hub for Indian players. Head-to-head reviews of HindCasino\'s listed operators — bonuses, payments, and games compared.',
  'about/index.html': 'About HindCasino — independent Indian casino listings since 2024. Our verification process, editorial standards, and why we don\'t accept paid rankings.',
  'best/casino-bonus-india/index.html': 'Best casino bonus offers in India 2026. Welcome matches, wagering terms, and realistic bonus value across top licensed operators.',
  'best/high-roller-casinos/index.html': 'Best high-roller casinos for India 2026. VIP limits, dedicated account managers, and premium withdrawal terms at top operators.',
  'guides/online-casino-legal-tamil-nadu/index.html': 'Is online casino legal in Tamil Nadu 2026? State ban explained, penalties, and what Tamil Nadu players need to know. Consult local advice.',
};

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !['go', 'css', 'js', 'scripts'].includes(e.name)) walk(p, files);
    else if (e.name === 'index.html') files.push(p);
  }
  return files;
}

function relPath(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function fixEncoding(content) {
  let out = content;
  for (const [from, to] of encodingFixes) out = out.split(from).join(to);
  return out;
}

function addTwitterImage(content) {
  if (content.includes('twitter:image')) return content;
  const ogMatch = content.match(/<meta property="og:image" content="([^"]+)"/);
  if (!ogMatch) return content;
  const insert = `  <meta name="twitter:image" content="${ogMatch[1]}">\n`;
  if (content.includes('twitter:description')) {
    return content.replace(
      /(<meta name="twitter:description" content="[^"]*">)/,
      `$1\n${insert.trimEnd()}`
    );
  }
  return content;
}

function addFullSocial(content, canonical, title, description, ogTitle) {
  const url = canonical;
  const og = ogTitle || title.replace(' | HindCasino', '');
  let out = content;

  if (!out.includes('og:locale')) {
    out = out.replace(
      /<meta property="og:type" content="[^"]*">/,
      `<meta property="og:type" content="article">\n  <meta property="og:locale" content="en_IN">\n  <meta property="og:site_name" content="HindCasino">`
    );
  }
  if (!out.includes('og:image')) {
    out = out.replace(
      /(<meta property="og:url" content="[^"]*">)/,
      `$1\n  <meta property="og:image" content="https://hindcasino.com/assets/og-image.jpg"`
    );
    if (!out.includes('og:url') && out.includes('og:description')) {
      out = out.replace(
        /(<meta property="og:description" content="[^"]*">)/,
        `$1\n  <meta property="og:url" content="${url}">\n  <meta property="og:image" content="https://hindcasino.com/assets/og-image.jpg"`
      );
    }
  }
  if (!out.includes('twitter:card')) {
    const twitterBlock = `
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${og.replace(/"/g, '&quot;')}">
  <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="https://hindcasino.com/assets/og-image.jpg">`;
    out = out.replace(/(\n  <link rel="preconnect")/, `${twitterBlock}\n$1`);
  }
  return out;
}

const files = walk(root).filter((f) => !f.includes(`${path.sep}go${path.sep}`));
let encFixed = 0, metaFixed = 0, twitterFixed = 0, socialFixed = 0;

for (const file of files) {
  const rel = relPath(file);
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  content = fixEncoding(content);

  if (metaFixes[rel]) {
    content = content.replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${metaFixes[rel]}">`
    );
    content = content.replace(
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${metaFixes[rel]}">`
    );
    if (content.includes('twitter:description')) {
      content = content.replace(
        /<meta name="twitter:description" content="[^"]*">/,
        `<meta name="twitter:description" content="${metaFixes[rel]}">`
      );
    }
    metaFixed++;
  }

  const canonical = (content.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const title = (content.match(/<title>([^<]+)<\/title>/) || [])[1];
  const desc = (content.match(/<meta name="description" content="([^"]+)"/) || [])[1];
  const ogTitle = (content.match(/<meta property="og:title" content="([^"]+)"/) || [])[1];

  if (!content.includes('twitter:card') && canonical && title && desc) {
    content = addFullSocial(content, canonical, title, desc, ogTitle);
    socialFixed++;
  }

  content = addTwitterImage(content);

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    if (content !== fixEncoding(original)) encFixed++;
    if (content.includes('twitter:image') && !original.includes('twitter:image')) twitterFixed++;
  }
}

console.log({ files: files.length, encFixed, metaFixed, twitterFixed, socialFixed });
