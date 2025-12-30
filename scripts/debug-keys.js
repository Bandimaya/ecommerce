const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const scanDirs=['app','components','contexts','hooks','lib','pages','app/home','app/register','app/login'];
let files = [];
for (const d of scanDirs) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  const walk = (dir) => {
    let arr = [];
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) arr = arr.concat(walk(full));
      else if (/\.(tsx|ts|jsx|js)$/.test(f)) arr.push(full);
    }
    return arr;
  };
  files = files.concat(walk(dir));
}
const regex = /t\(['"`]([^'"`]+)['"`]\)/g;
const used = new Map();
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = regex.exec(src))) {
    const key = m[1];
    if (!used.has(key)) used.set(key, []);
    used.get(key).push(file);
  }
}
console.log('Total keys', used.size);
for (const [k, locations] of used) {
  if (k.length <= 1 || k === '.') {
    console.log('key:', JSON.stringify(k), 'len:', k.length, 'locations:', locations.slice(0,3));
  }
}
