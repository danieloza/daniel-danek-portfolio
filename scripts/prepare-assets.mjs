import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
mkdirSync(resolve(root, 'assets/fonts'), { recursive: true });
mkdirSync(resolve(root, 'assets/icons'), { recursive: true });
const font = resolve(root, 'node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2');
copyFileSync(font, resolve(root, 'assets/fonts/geist-variable.woff2'));
copyFileSync(resolve(root, 'node_modules/geist/LICENSE.txt'), resolve(root, 'assets/fonts/LICENSE.txt'));
copyFileSync(resolve(root, 'node_modules/@tabler/icons/LICENSE'), resolve(root, 'assets/icons/LICENSE.txt'));

const names = ['home', 'briefcase', 'code', 'stack-2', 'mail', 'brand-github', 'brand-linkedin', 'sun', 'moon', 'arrow-up-right', 'download', 'chevron-right', 'copy', 'check'];
const symbols = names.map(name => {
  const source = readFileSync(resolve(root, `node_modules/@tabler/icons/icons/outline/${name}.svg`), 'utf8');
  const body = source.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '');
  return `<symbol id="${name}" viewBox="0 0 24 24">${body}</symbol>`;
});
writeFileSync(resolve(root, 'assets/icons/tabler-sprite.svg'), `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('\n')}</svg>\n`);
console.log('Prepared self-hosted Geist font and Tabler icon sprite.');
