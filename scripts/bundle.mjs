// scripts/bundle.mjs
// รวมไฟล์ JS ที่ได้จาก tsc (โฟลเดอร์ dist/) ให้เป็นไฟล์เดียว: standalone.html
// เพื่อให้ดับเบิลคลิกเปิดได้เลยโดยไม่ต้องรันเซิร์ฟเวอร์ (ไม่ต้องติดตั้งแพ็กเกจเพิ่ม ใช้แค่ Node.js)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const importRe = /^import\s+(?:[\s\S]*?)\s+from\s+['"](.+?)['"];?\s*$/gm;

const ordered = [];
const seen = new Set();
function visit(file) {
    if (seen.has(file)) return;
    seen.add(file);
    const code = readFileSync(file, 'utf8');
    for (const m of code.matchAll(importRe)) visit(resolve(dirname(file), m[1]));
    ordered.push({ file, code });
}
visit(resolve(dist, 'main.js'));

const body = ordered
    .map(({ file, code }) => `// ---- ${file.slice(dist.length + 1)} ----\n` +
        code.replace(importRe, '').replace(/^export\s+(?=(abstract\s+)?(class|function|const|let|var|enum)\b)/gm, ''))
    .join('\n');

const html = readFileSync(resolve(root, 'index.html'), 'utf8')
    .replace('<link rel="stylesheet" href="style.css" />', `<style>\n${readFileSync(resolve(root, 'style.css'), 'utf8')}</style>`)
    .replace('<script type="module" src="dist/main.js"></script>', `<script>\n(() => {\n${body}\n})();\n</script>`);

writeFileSync(resolve(root, 'standalone.html'), html);
console.log(`standalone.html สร้างเสร็จ (${ordered.length} โมดูล)`);
