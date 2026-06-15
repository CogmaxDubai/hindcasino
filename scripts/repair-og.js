const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const OG_IMAGE = 'https://hindcasino.com/assets/og-image.jpg';

const files = [
  'best/crypto-casinos-india/index.html',
  'best/live-casinos-india/index.html',
  'best/new-casinos-india/index.html',
  'best/no-deposit-bonus-casinos/index.html',
  'best/real-money-casinos/index.html',
  'best/teen-patti-casinos/index.html',
  'bonuses/welcome-bonus/index.html',
  'games/andar-bahar/index.html',
  'games/aviator/index.html',
  'payments/upi/index.html',
];

const metaFixes = {
  'best/teen-patti-casinos/index.html': 'Best Teen Patti casinos for Indian players 2026. Top 5 sites ranked by live Teen Patti selection, providers, variants, UPI support, and Hindi tables.',
};

for (const rel of files) {
  const file = path.join(root, rel);
  let c = fs.readFileSync(file, 'utf8');
  const desc = metaFixes[rel] || (c.match(/<meta name="description" content="([^"]+)"/) || [])[1];
  const canonical = (c.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const ogTitle = (c.match(/<meta property="og:title" content="([^"]+)"/) || [])[1];

  if (metaFixes[rel]) {
    c = c.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`);
    c = c.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${desc}">`);
  }

  if (!c.includes('og:description') && ogTitle && desc && canonical) {
    c = c.replace(
      /<meta property="og:title" content="[^"]*">/,
      `<meta property="og:title" content="${ogTitle}">\n  <meta property="og:description" content="${desc}">\n  <meta property="og:url" content="${canonical}">\n  <meta property="og:image" content="${OG_IMAGE}">`
    );
  }

  fs.writeFileSync(file, c, 'utf8');
  console.log('fixed', rel);
}
