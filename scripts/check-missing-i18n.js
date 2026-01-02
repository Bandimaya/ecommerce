const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const walk = (dir) => fs.readdirSync(dir).flatMap(f => {
  const p = path.join(dir, f);
  if (fs.statSync(p).isDirectory()) return walk(p);
  if (p.includes('node_modules') || p.includes('.git')) return [];
  if (!p.endsWith('.ts') && !p.endsWith('.tsx') && !p.endsWith('.js') && !p.endsWith('.jsx')) return [];
  return [p];
});

const files = walk(root);
const keyRe = /t\(\s*['\"]([^'\"]+)['\"]\s*(,\s*\{[^}]*\})?\s*\)/g;
const found = new Set();
for (const f of files) {
  const txt = fs.readFileSync(f,'utf8');
  let m;
  while ((m = keyRe.exec(txt)) !== null) found.add(m[1]);
}

const i18nFile = path.join(root, 'lib', 'i18n.ts');
const i18nTxt = fs.existsSync(i18nFile) ? fs.readFileSync(i18nFile,'utf8') : '';
const has = (k) => i18nTxt.includes(`'${k}':`);

const missing = [...found].filter(k => !has(k)).sort();
console.log('Found', found.size, 'keys, missing', missing.length);
if (missing.length) console.log(missing.join('\n'));
else console.log('No missing keys found');
