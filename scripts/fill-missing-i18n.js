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

const scanDirs = ['app', 'components', 'contexts', 'hooks', 'lib', 'pages'];
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

const usedKeys = new Set();
const regex = /t\(['"`]([^'"`]+)['"`]\)/g;
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = regex.exec(src))) {
    usedKeys.add(m[1]);
  }
}

const missing = [];
for (const k of usedKeys) {
  if (!enKeys.has(k)) missing.push(k);
}

if (missing.length === 0) {
  console.log('No missing keys');
  process.exit(0);
}

console.log('Adding', missing.length, 'missing keys to en.json');

function titleize(s) {
  return s
    .replace(/[_-]/g, ' ')
    .replace(/\{\{(.*?)\}\}/g, (m, p1) => `{{${p1}}}`) // keep placeholders
    .split(' ')
    .map(w => w ? w[0].toUpperCase()+w.slice(1) : '')
    .join(' ');
}

for (const k of missing) {
  const parts = k.split('.');
  let cur = en;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === parts.length - 1) {
      if (typeof cur[p] === 'undefined') {
        // generate default value
        cur[p] = titleize(p.replace(/\{\{(.*?)\}\}/g, (m,p1)=>`{{${p1}}}`));
      }
    } else {
      if (typeof cur[p] === 'undefined') cur[p] = {};
      cur = cur[p];
    }
  }
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
console.log('Updated en.json with defaults for missing keys');
