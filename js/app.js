import {
  deleteDataset, deleteRecord, exportAllData, getAll, getDatasets,
  getItemsForDataset, getRecord, itemKey, migrateLegacyLocalStorage,
  putRecord, restoreAllData, saveContentPack, seedBuiltInPack
} from './db.js';
import { contentPackTemplate, downloadJson, parseImport, readFileAsText } from './import-export.js';

const $ = id => document.getElementById(id);
const state = { datasets: [], active: null, items: [], current: null, noteTimer: null };

const el = Object.fromEntries([
  'datasetSelect','searchInput','searchBtn','statusBar','searchResults','reader','readerActions',
  'favoriteCurrentBtn','copyCurrentBtn','noteInput','noteContext','vocabWordInput','vocabMeaningInput',
  'addVocabBtn','vocabList','vocabCount','libraryDialog','favoritesDialog','settingsDialog','libraryBtn',
  'favoritesBtn','settingsBtn','importFileInput','pasteImportInput','importContentBtn','importStatus',
  'downloadTemplateBtn','exportDatasetBtn','deleteDatasetBtn','datasetInfo','backupBtn','restoreBackupInput',
  'backupStatus','favoritesList','themeSelect','fontSizeRange','fontSizeValue','layoutSelect'
].map(id => [id, $(id)]));

main().catch(err => setStatus(`初始化失败：${err.message}`, true));

async function main() {
  bind(); applyPrefs();
  let seeded = false;
  try { seeded = await seedBuiltInPack(); }
  catch { seeded = await seedFromLegacyDataJs(); }
  const migration = await migrateLegacyLocalStorage();
  await refreshDatasets();
  if (migration.migrated) setStatus(`已迁移旧数据：收藏 ${migration.favoriteCount} 条，生词 ${migration.vocabCount} 个。`);
  else if (seeded) setStatus('已将内置公司法写入本地 IndexedDB。');
  else setStatus('数据保存在当前浏览器；建议定期导出完整备份。');
}

async function seedFromLegacyDataJs() {
  if ((await getDatasets()).some(d => d.id === 'cn.company-law.2023')) return false;
  const text = await fetch('./data.js', { cache: 'no-cache' }).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text();
  });
  const expr = text.replace(/^\s*const\s+companyLawData\s*=\s*/, 'return ').replace(/;\s*$/, ';');
  const rows = Function(expr)();
  if (!Array.isArray(rows)) throw new Error('旧 data.js 格式无法识别');
  await saveContentPack({
    schemaVersion: 1,
    manifest: {
      id: 'cn.company-law.2023', title: '中华人民共和国公司法（中英对照）',
      version: '2023', type: 'law',
      fields: [
        { id: 'zh', label: '中文', searchable: true },
        { id: 'en', label: 'English', searchable: true }
      ]
    },
    items: rows.map((r, i) => ({
      id: `article-${r.article ?? i + 1}`, order: Number(r.article) || i + 1,
      title: `第 ${r.article ?? i + 1} 条`, fields: { zh: String(r.cn || ''), en: String(r.en || '') }, tags: []
    }))
  });
  return true;
}

function bind() {
  el.datasetSelect.onchange = () => activate(el.datasetSelect.value);
  el.searchBtn.onclick = search;
  el.searchInput.onkeydown = e => { if (e.key === 'Enter') search(); };
  el.favoriteCurrentBtn.onclick = toggleFavorite;
  el.copyCurrentBtn.onclick = copyCurrent;
  el.noteInput.oninput = () => { clearTimeout(state.noteTimer); state.noteTimer = setTimeout(saveNote, 350); };
  el.addVocabBtn.onclick = addVocab;
  el.libraryBtn.onclick = async () => { await renderDatasetInfo(); el.libraryDialog.showModal(); };
  el.favoritesBtn.onclick = async () => { await renderFavorites(); el.favoritesDialog.showModal(); };
  el.settingsBtn.onclick = () => el.settingsDialog.showModal();
  el.importContentBtn.onclick = importContent;
  el.downloadTemplateBtn.onclick = () => downloadJson('exercise-content-pack-template.json', contentPackTemplate());
  el.exportDatasetBtn.onclick = exportDataset;
  el.deleteDatasetBtn.onclick = removeDataset;
  el.backupBtn.onclick = exportBackup;
  el.restoreBackupInput.onchange = restoreBackup;
  el.themeSelect.onchange = savePrefs; el.fontSizeRange.oninput = savePrefs; el.layoutSelect.onchange = savePrefs;
}

async function refreshDatasets(preferred) {
  state.datasets = await getDatasets(); el.datasetSelect.innerHTML = '';
  for (const d of state.datasets) {
    const o = document.createElement('option'); o.value = d.id; o.textContent = d.version ? `${d.title} · ${d.version}` : d.title; el.datasetSelect.append(o);
  }
  if (!state.datasets.length) { renderEmpty('暂无资料库','请打开“资料库”导入 JSON、CSV 或 Markdown。'); return; }
  const stored = localStorage.getItem('exercise.activeDatasetId');
  const id = preferred || (state.datasets.some(d => d.id === stored) ? stored : state.datasets[0].id);
  el.datasetSelect.value = id; await activate(id);
}

async function activate(id) {
  state.active = state.datasets.find(d => d.id === id) || null;
  state.items = state.active ? await getItemsForDataset(id) : []; state.current = null;
  localStorage.setItem('exercise.activeDatasetId', id); el.searchInput.value = ''; el.searchResults.classList.add('hidden');
  renderEmpty(state.active?.title || '暂无资料库', state.active ? `已载入 ${state.items.length} 个条目。` : '请导入资料。');
  await renderVocabs(); await renderDatasetInfo();
}

function search() {
  const q = el.searchInput.value.trim(); if (!state.active || !q) return setStatus('请输入检索内容。', true);
  const n = q.match(/^\s*(?:第\s*)?(\d+)(?:\s*条)?\s*$/)?.[1]; const low = q.toLowerCase();
  const fields = (state.active.fields || []).filter(f => f.searchable !== false).map(f => f.id);
  const results = state.items.map(item => {
    let score = 0; if (n && (String(item.order) === n || item.id === `article-${n}`)) score += 100;
    if ((item.title || '').toLowerCase().includes(low)) score += 30;
    for (const f of fields) if (String(item.fields?.[f] || '').toLowerCase().includes(low)) score += 10;
    return { item, score };
  }).filter(x => x.score).sort((a,b) => b.score-a.score || a.item.order-b.item.order).slice(0,50);
  renderResults(results); setStatus(`找到 ${results.length} 个结果。`); if (results.length === 1) selectItem(results[0].item.id);
}

function renderResults(results) {
  el.searchResults.innerHTML = ''; el.searchResults.classList.remove('hidden');
  if (!results.length) { el.searchResults.innerHTML = '<div class="empty-list">没有找到匹配内容。</div>'; return; }
  for (const { item } of results) {
    const b = document.createElement('button'); b.className = 'result-item'; b.type='button';
    const text = Object.values(item.fields || {}).join(' ').replace(/\s+/g,' ').slice(0,140);
    b.innerHTML = `<span class="result-title">${esc(item.title)}</span><span class="result-snippet">${esc(text)}</span>`;
    b.onclick = () => selectItem(item.id); el.searchResults.append(b);
  }
}

async function selectItem(id) {
  state.current = state.items.find(x => x.id === id); if (!state.current) return;
  el.reader.classList.remove('empty-state'); el.reader.innerHTML = `<div class="reader-header"><div><h2 class="reader-title">${esc(state.current.title)}</h2><div class="reader-meta">${esc(state.active.title)} · ${esc(state.active.id)}/${esc(state.current.id)}</div></div></div>`;
  const grid = document.createElement('div'); grid.className='field-grid'; grid.dataset.layout=localStorage.getItem('exercise.layout')||'auto';
  for (const f of state.active.fields || []) { const s=document.createElement('section'); s.className='content-card'; s.innerHTML=`<h3>${esc(f.label||f.id)}</h3><div class="content-text">${esc(state.current.fields?.[f.id]||'')}</div>`; grid.append(s); }
  el.reader.append(grid); el.readerActions.classList.remove('hidden'); el.noteInput.disabled=false; el.noteContext.textContent=state.current.title;
  const key=itemKey(state.active.id,state.current.id); el.noteInput.value=(await getRecord('notes',key))?.text||''; await refreshFavorite();
}

async function toggleFavorite() {
  if (!state.current) return; const key=itemKey(state.active.id,state.current.id); const old=await getRecord('favorites',key);
  if (old) await deleteRecord('favorites',key); else await putRecord('favorites',{key,datasetId:state.active.id,itemId:state.current.id,createdAt:new Date().toISOString()}); await refreshFavorite();
}
async function refreshFavorite(){ const yes=state.current && await getRecord('favorites',itemKey(state.active.id,state.current.id)); el.favoriteCurrentBtn.textContent=yes?'★ 已收藏（点击取消）':'☆ 收藏当前条目'; }
async function saveNote(){ if(!state.current)return; const key=itemKey(state.active.id,state.current.id), text=el.noteInput.value; if(text.trim()) await putRecord('notes',{key,datasetId:state.active.id,itemId:state.current.id,text,updatedAt:new Date().toISOString()}); else await deleteRecord('notes',key); }

async function addVocab(){ const word=el.vocabWordInput.value.trim(); if(!word||!state.active)return; await putRecord('vocabs',{id:crypto.randomUUID(),datasetId:state.active.id,itemId:state.current?.id||null,word,meaning:el.vocabMeaningInput.value.trim()||'暂无释义',createdAt:new Date().toISOString()}); el.vocabWordInput.value='';el.vocabMeaningInput.value='';await renderVocabs(); }
async function renderVocabs(){ const rows=(await getAll('vocabs')).filter(v=>!state.active||v.datasetId===state.active.id).sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')); el.vocabCount.textContent=rows.length; el.vocabList.innerHTML=''; for(const v of rows){const li=document.createElement('li');li.className='vocab-item';li.innerHTML=`<div><strong class="vocab-word">${esc(v.word)}</strong><div class="vocab-meaning">${esc(v.meaning)}</div></div>`;const d=document.createElement('button');d.className='small-delete';d.textContent='删除';d.onclick=async()=>{await deleteRecord('vocabs',v.id);await renderVocabs();};li.append(d);el.vocabList.append(li);} }

async function renderFavorites(){ const favs=await getAll('favorites'), items=await getAll('items'); el.favoritesList.innerHTML=''; for(const f of favs){const item=items.find(i=>i.datasetId===f.datasetId&&i.id===f.itemId);if(!item)continue;const b=document.createElement('button');b.className='result-item';b.innerHTML=`<span class="result-title">${esc(item.title)}</span><span class="result-snippet">${esc(f.datasetId)}</span>`;b.onclick=async()=>{await refreshDatasets(f.datasetId);await selectItem(item.id);el.favoritesDialog.close();};el.favoritesList.append(b);} if(!el.favoritesList.children.length)el.favoritesList.innerHTML='<div class="empty-list">暂无收藏。</div>'; }

async function importContent(){ try{const file=el.importFileInput.files?.[0], text=file?await readFileAsText(file):el.pasteImportInput.value.trim();if(!text)throw new Error('请选择文件或粘贴内容');const p=parseImport(text,{filename:file?.name||'',titleHint:file?.name?.replace(/\.[^.]+$/,'')||''});const r=await saveContentPack({schemaVersion:1,manifest:p.manifest,items:p.items},{replace:true});el.importStatus.textContent=`导入成功：${r.manifest.title}，${r.itemCount} 个条目。`;await refreshDatasets(r.manifest.id);}catch(e){el.importStatus.textContent=`导入失败：${e.message}`;} }
async function exportDataset(){ if(!state.active)return; const items=await getItemsForDataset(state.active.id);const {importedAt,...manifest}=state.active;downloadJson(`${safe(state.active.title)}.content-pack.json`,{schemaVersion:1,manifest,items:items.map(({key,datasetId,...x})=>x)}); }
async function removeDataset(){ if(!state.active||!confirm(`确定删除“${state.active.title}”吗？`))return;await deleteDataset(state.active.id);await refreshDatasets(); }
async function exportBackup(){ try{downloadJson(`exercise-v2-backup-${new Date().toISOString().slice(0,10)}.json`,await exportAllData());el.backupStatus.textContent='完整备份已导出。';}catch(e){el.backupStatus.textContent=e.message;} }
async function restoreBackup(e){ try{const file=e.target.files?.[0];if(!file)return;if(!confirm('恢复备份会覆盖当前数据，确定继续吗？'))return;await restoreAllData(JSON.parse(await file.text()));await refreshDatasets();applyPrefs();el.backupStatus.textContent='恢复完成。';}catch(err){el.backupStatus.textContent=err.message;}finally{e.target.value='';} }
async function renderDatasetInfo(){ el.datasetInfo.innerHTML=state.active?`<strong>${esc(state.active.title)}</strong><br>ID：${esc(state.active.id)}<br>版本：${esc(state.active.version||'—')}<br>条目：${state.items.length}`:'<span class="muted-note">当前没有资料库。</span>'; }
async function copyCurrent(){ if(!state.current)return;const parts=[`${state.current.title}｜${state.active.title}`];for(const f of state.active.fields||[])parts.push(`\n${f.label||f.id}\n${state.current.fields?.[f.id]||''}`);await navigator.clipboard.writeText(parts.join('\n'));setStatus('已复制当前条目。'); }

function renderEmpty(title,body){state.current=null;el.reader.className='reader panel empty-state';el.reader.innerHTML=`<div class="empty-illustration">⌕</div><h2>${esc(title)}</h2><p>${esc(body)}</p>`;el.readerActions.classList.add('hidden');el.noteInput.value='';el.noteInput.disabled=true;el.noteContext.textContent='未选择条目';}
function setStatus(msg,error=false){el.statusBar.textContent=msg;el.statusBar.style.color=error?'var(--danger)':'';}
function applyPrefs(){const theme=localStorage.getItem('exercise.theme')||'system',size=localStorage.getItem('exercise.fontSize')||'16',layout=localStorage.getItem('exercise.layout')||'auto';el.themeSelect.value=theme;el.fontSizeRange.value=size;el.fontSizeValue.textContent=`${size}px`;el.layoutSelect.value=layout;document.documentElement.style.setProperty('--reader-font-size',`${size}px`);document.documentElement.dataset.theme=theme==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;}
function savePrefs(){localStorage.setItem('exercise.theme',el.themeSelect.value);localStorage.setItem('exercise.fontSize',el.fontSizeRange.value);localStorage.setItem('exercise.layout',el.layoutSelect.value);applyPrefs();}
function esc(v){return String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');}
function safe(v){return String(v||'dataset').replace(/[\\/:*?"<>|]/g,'-').slice(0,80);}
