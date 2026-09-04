import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, parseCsvPack, parseMarkdownPack, parseJsonPack } from '../js/import-export.js';

test('CSV parser handles quoted commas', () => {
  const rows = parseCsv('article,中文,英文\n1,"你好,世界","hello, world"');
  assert.deepEqual(rows[1], ['1', '你好,世界', 'hello, world']);
});

test('CSV imports into content pack', () => {
  const pack = parseCsvPack('article,中文,英文\n1,第一条,Article one', '测试法');
  assert.equal(pack.items[0].id, 'article-1');
  assert.equal(pack.items[0].fields.zh, '第一条');
  assert.equal(pack.items[0].fields.en, 'Article one');
});

test('Markdown imports H1 entries and H2 fields', () => {
  const pack = parseMarkdownPack('# 第 1 条\n## 中文\n第一条\n## English\nArticle one', '测试法');
  assert.equal(pack.items.length, 1);
  assert.equal(pack.items[0].id, 'article-1');
});

test('legacy JSON array is accepted', () => {
  const pack = parseJsonPack(JSON.stringify([{ article: 1, cn: '中文', en: 'English' }]), '旧数据');
  assert.equal(pack.items[0].fields.zh, '中文');
  assert.equal(pack.items[0].fields.en, 'English');
});
