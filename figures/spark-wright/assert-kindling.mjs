#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../..');
const card = JSON.parse(readFileSync(join(here, 'kindling.json'), 'utf8'));

if (card.figureId !== 'spark-wright') throw new Error('bad figureId');
const banned = card.bannedTokens || [];
if (banned.some((t) => card.figureId.includes(t))) throw new Error('banned in id');
const kit = card.surfaces.filter((s) => s.class === 'kit');
if (kit.length < 3) throw new Error('need 3+ kit surfaces');
let ok = 0;
for (const s of card.surfaces) {
  if (!existsSync(join(root, s.path))) throw new Error('missing ' + s.path);
  ok += 1;
}
if (!card.frozen.includes('challengeAgent.ts')) throw new Error('challenge not frozen');
console.log(`ok spark-wright ${ok}/${card.surfaces.length}`);
