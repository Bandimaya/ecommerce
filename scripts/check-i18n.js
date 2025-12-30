const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const enPath = path.join(root, 'locales', 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function collectKeys(obj, prefix = '') {
  const keys = new Set();
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof val === 'string') keys.add(key);
    else if (typeof val === 'object' && val !== null) {
      const sub = collectKeys(val, key);
      for (const s of sub) keys.add(s);
    }
  }
  return keys;
}

const enKeys = collectKeys(en);

// scan files for t('key') patterns
// Only scan the main app folders to avoid node_modules noise
const scanDirs = ['app', 'components', 'contexts', 'hooks', 'lib', 'pages', 'app/home', 'app/register', 'app/login'];
let files = [];
for (const d of scanDirs) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  const walk = (dir) => {
    let files = [];
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        files = files.concat(walk(full));
      } else if (/\.(tsx|ts|jsx|js)$/.test(f)) files.push(full);
    }
    return files;
  };
  files = files.concat(walk(dir));
}
const usedKeys = new Map();
const regex = /t\(['"`]([^'"`]+)['"`]\)/g;
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = regex.exec(src))) {
    const key = m[1];
    if (!usedKeys.has(key)) usedKeys.set(key, []);
    usedKeys.get(key).push(file);
  }
}

const missing = [];
for (const [k, locations] of usedKeys) {
  if (!enKeys.has(k)) missing.push({ key: k, locations });
}

console.log('Found', usedKeys.size, 'used keys.');
console.log('Missing keys from en.json (', missing.length, '):');
for (const m of missing) {
  console.log('- ', m.key);
  console.log('   used in:', m.locations.slice(0,3).join(', '));
}

// exit with non-zero if missing
if (missing.length > 0) process.exit(2);
else process.exit(0);
