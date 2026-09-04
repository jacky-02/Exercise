import { normalizeContentPack } from './db.js';

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  downloadBlob(filename, blob);
}

export function downloadText(filename, text, type = 'text/plain;charset=utf-8') {
  downloadBlob(filename, new Blob([text], { type }));
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function readFileAsText(file) {
  if (!file) return '';
  return file.text();
}

export function detectFormat(text, filename = '') {
  const trimmed = text.trim();
  const lower = filename.toLowerCase();
  if (lower.endsWith('.json') || trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  if (lower.endsWith('.md') || lower.endsWith('.markdown') || /^#{1,3}\s/m.test(trimmed)) return 'markdown';
  return 'csv';
}

export function parseImport(text, { filename = '', titleHint = '' } = {}) {
  const format = detectFormat(text, filename);
  if (format === 'json') return parseJsonPack(text, titleHint);
  if (format === 'markdown') return parseMarkdownPack(text, titleHint || stripExtension(filename));
  return parseCsvPack(text, titleHint || stripExtension(filename));
}

export function parseJsonPack(text, titleHint = '') {
  const data = JSON.parse(text);

  if (data?.schemaVersion === 1 && data?.manifest && Array.isArray(data?.items)) {
    return normalizeContentPack(data);
  }

  const legacyArray = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : null;
  if (legacyArray && legacyArray.every(item => item && typeof item === 'object')) {
    const cnKey = findKey(legacyArray[0], ['cn', 'zh', '中文']);
    const enKey = findKey(legacyArray[0], ['en', 'english', '英文']);
    const articleKey = findKey(legacyArray[0], ['article', '序号', '编号', 'order']);
    if (cnKey || enKey) {
      const title = titleHint || '导入资料';
      return normalizeContentPack(makeBilingualPack(legacyArray, { title, cnKey, enKey, articleKey }));
    }
  }

  throw new Error('JSON 无法识别。请使用 Content Pack schemaVersion=1，或传入含 cn/en 字段的旧数组。');
}

export function parseCsvPack(text, title = 'CSV 导入资料') {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error('CSV 至少需要表头和一行内容。');
  const headers = rows[0].map((header, index) => (index === 0 ? header.replace(/^\uFEFF/, '') : header).trim()).filter(Boolean);
  if (!headers.length) throw new Error('CSV 表头为空。');

  const dataRows = rows.slice(1).filter(row => row.some(cell => String(cell).trim() !== ''));
  const articleHeader = firstMatchingHeader(headers, ['article', '序号', '编号', 'order', 'no', 'number']);
  const titleHeader = firstMatchingHeader(headers, ['title', '标题', '条目']);

  const reserved = new Set([articleHeader, titleHeader].filter(Boolean));
  let fieldHeaders = headers.filter(header => !reserved.has(header));
  if (!fieldHeaders.length) fieldHeaders = headers.filter(header => header !== articleHeader);

  const fieldDefs = fieldHeaders.map(header => ({ id: slugifyField(header), label: header, searchable: true }));
  const usedFieldIds = new Set();
  for (const field of fieldDefs) {
    let id = field.id || 'field';
    let suffix = 2;
    while (usedFieldIds.has(id)) id = `${field.id}-${suffix++}`;
    field.id = id;
    usedFieldIds.add(id);
  }

  const idMap = new Map(fieldDefs.map((field, index) => [fieldHeaders[index], field.id]));
  const items = dataRows.map((row, index) => {
    const obj = Object.fromEntries(headers.map((header, col) => [header, row[col] ?? '']));
    const orderValue = articleHeader ? Number(obj[articleHeader]) : index + 1;
    const order = Number.isFinite(orderValue) ? orderValue : index + 1;
    const itemTitle = titleHeader && obj[titleHeader]
      ? obj[titleHeader]
      : articleHeader && obj[articleHeader]
        ? `第 ${obj[articleHeader]} 条`
        : `条目 ${index + 1}`;
    const fields = {};
    for (const header of fieldHeaders) fields[idMap.get(header)] = String(obj[header] ?? '');
    return { id: articleHeader && obj[articleHeader] ? `article-${safeId(obj[articleHeader])}` : `item-${index + 1}`, order, title: itemTitle, fields };
  });

  return normalizeContentPack({
    schemaVersion: 1,
    manifest: {
      id: makeDatasetId(title),
      title: title || 'CSV 导入资料',
      type: 'custom',
      version: '1',
      fields: fieldDefs
    },
    items
  });
}

export function parseMarkdownPack(text, title = 'Markdown 导入资料') {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const sections = [];
  let current = null;
  let currentField = '正文';

  for (const line of lines) {
    const h1 = line.match(/^#\s+(.+)$/);
    if (h1) {
      if (current) sections.push(current);
      current = { title: h1[1].trim(), fields: {} };
      currentField = '正文';
      current.fields[currentField] = [];
      continue;
    }

    const h2 = line.match(/^##\s+(.+)$/);
    if (h2 && current) {
      currentField = h2[1].trim();
      current.fields[currentField] ||= [];
      continue;
    }

    if (!current && line.trim()) {
      current = { title: '条目 1', fields: { 正文: [] } };
      currentField = '正文';
    }
    if (current) current.fields[currentField].push(line);
  }
  if (current) sections.push(current);
  if (!sections.length) throw new Error('Markdown 中没有可导入内容。');

  const labels = [];
  for (const section of sections) {
    for (const label of Object.keys(section.fields)) if (!labels.includes(label)) labels.push(label);
  }
  const fieldDefs = labels.map(label => ({ id: slugifyField(label), label, searchable: true }));
  const idsByLabel = Object.fromEntries(fieldDefs.map(field => [field.label, field.id]));

  const items = sections.map((section, index) => {
    const fields = {};
    for (const label of labels) fields[idsByLabel[label]] = (section.fields[label] || []).join('\n').trim();
    const articleMatch = section.title.match(/(?:第\s*)?(\d+)(?:\s*条)?/);
    const order = articleMatch ? Number(articleMatch[1]) : index + 1;
    return { id: articleMatch ? `article-${articleMatch[1]}` : `item-${index + 1}`, order, title: section.title, fields };
  });

  return normalizeContentPack({
    schemaVersion: 1,
    manifest: { id: makeDatasetId(title), title: title || 'Markdown 导入资料', type: 'custom', version: '1', fields: fieldDefs },
    items
  });
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') inQuotes = true;
    else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  row.push(field.replace(/\r$/, ''));
  if (row.length > 1 || row[0] !== '') rows.push(row);
  return rows;
}

export function contentPackTemplate() {
  return {
    schemaVersion: 1,
    manifest: {
      id: 'my.custom.dataset',
      title: '我的资料库',
      version: '1',
      type: 'custom',
      fields: [
        { id: 'zh', label: '中文', searchable: true },
        { id: 'en', label: 'English', searchable: true }
      ]
    },
    items: [
      {
        id: 'item-1',
        order: 1,
        title: '示例条目',
        fields: { zh: '示例中文内容', en: 'Example English content' },
        tags: ['示例']
      }
    ]
  };
}

export function makeDatasetId(title) {
  const base = String(title || 'dataset')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 48) || 'dataset';
  return `custom.${base}.${Date.now().toString(36)}`;
}

function makeBilingualPack(rows, { title, cnKey, enKey, articleKey }) {
  return {
    schemaVersion: 1,
    manifest: {
      id: makeDatasetId(title),
      title,
      version: '1',
      type: 'custom',
      fields: [
        ...(cnKey ? [{ id: 'zh', label: '中文', searchable: true }] : []),
        ...(enKey ? [{ id: 'en', label: 'English', searchable: true }] : [])
      ]
    },
    items: rows.map((row, index) => {
      const article = articleKey ? row[articleKey] : index + 1;
      return {
        id: articleKey ? `article-${safeId(article)}` : `item-${index + 1}`,
        order: Number(article) || index + 1,
        title: articleKey ? `第 ${article} 条` : `条目 ${index + 1}`,
        fields: {
          ...(cnKey ? { zh: String(row[cnKey] ?? '') } : {}),
          ...(enKey ? { en: String(row[enKey] ?? '') } : {})
        }
      };
    })
  };
}

function firstMatchingHeader(headers, candidates) {
  const normalized = new Map(headers.map(h => [String(h).trim().toLowerCase(), h]));
  for (const candidate of candidates) if (normalized.has(candidate.toLowerCase())) return normalized.get(candidate.toLowerCase());
  return null;
}

function findKey(obj, candidates) {
  if (!obj) return null;
  const keys = Object.keys(obj);
  return firstMatchingHeader(keys, candidates);
}

function slugifyField(value) {
  const raw = String(value || '').trim().toLowerCase();
  const known = {
    '中文': 'zh', 'cn': 'zh', 'zh': 'zh', 'chinese': 'zh',
    '英文': 'en', 'english': 'en', 'en': 'en',
    '释义': 'explanation', '解释': 'explanation', 'explanation': 'explanation',
    '正文': 'body', 'body': 'body', 'text': 'body'
  };
  if (known[raw]) return known[raw];
  return raw.replace(/\s+/g, '-').replace(/[^a-z0-9\u4e00-\u9fff_-]/g, '').slice(0, 36) || 'field';
}

function safeId(value) {
  return String(value).trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\u4e00-\u9fff._-]/g, '').slice(0, 60) || crypto.randomUUID();
}

function stripExtension(filename) {
  return String(filename || '').replace(/\.[^.]+$/, '') || '导入资料';
}
