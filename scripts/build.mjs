import { cpSync, mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const localPaths = [...html.matchAll(/(?:src|href)="\.\/([^"#?]+)(?:[^\"]*)?"/g)].map(match => match[1]);
for (const path of new Set(localPaths)) {
  if (!existsSync(resolve(root, path))) throw new Error(`Missing public asset: ${path}`);
}
if (/[\u2013\u2014]/.test(html)) throw new Error('Use regular hyphens in visible copy.');
if (/Żabka|Orlen|Bitai/i.test(html)) throw new Error('Confidential client names must not be published.');
mkdirSync(resolve(root, 'dist'), { recursive: true });
cpSync(resolve(root, 'index.html'), resolve(root, 'dist/index.html'));
cpSync(resolve(root, 'assets'), resolve(root, 'dist/assets'), { recursive: true });
if (existsSync(resolve(root, 'THIRD_PARTY_NOTICES.md'))) cpSync(resolve(root, 'THIRD_PARTY_NOTICES.md'), resolve(root, 'dist/THIRD_PARTY_NOTICES.md'));
writeFileSync(resolve(root, 'dist/.nojekyll'), '');
console.log(`Static site staged in dist. Validated ${new Set(localPaths).size} referenced local assets.`);
