// glossary/js/loader.js - 이전 UI 호환 + Supabase 우선 로드
import { supabase } from './supabase.js';
import { CSV_PATH } from './config.js';

function parseCSVLine(line) {
  const cols = [];
  let cur = '', inQ = false;
  for (let i=0;i<line.length;i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i+1]==='"') { cur+='"'; i++; }
      else inQ = !inQ;
    } else if (c===',' && !inQ) { cols.push(cur); cur=''; }
    else cur+=c;
  }
  cols.push(cur);
  return cols;
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map(h=>h.trim().replace(/^"|"$/g,'').toLowerCase());
  const idx = {}; headers.forEach((h,i)=> idx[h]=i);
  const get = (cols, ...names) => {
    for (const n of names) {
      const i = idx[n.toLowerCase()];
      if (i!==undefined && cols[i]!==undefined) {
        let v = cols[i].trim();
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1,-1).replace(/""/g,'"');
        return v;
      }
    }
    return '';
  };
  const out=[];
  for (let i=1;i<lines.length;i++) {
    if (!lines[i].trim()) continue;
    const cols = parseCSVLine(lines[i]);
    out.push({
      id: get(cols,'id'),
      term: get(cols,'term'),
      fullname: get(cols,'fullname'),
      meaning: get(cols,'meaning'),
      example: get(cols,'example'),
      category: get(cols,'category'),
      longDesc: get(cols,'longdesc','longDesc'),
      longdesc: get(cols,'longdesc','longDesc'),
      defaultFav: get(cols,'defaultfav','defaultFav'),
      defaultfav: get(cols,'defaultfav','defaultFav')
    });
  }
  return out;
}

function normalizeTerm(t) {
  const longDesc = (t.longDesc || t.longdesc || '').trim();
  const defaultFav = (t.defaultFav || t.defaultfav || '').toString().trim();
  return {
    id: (t.id||'').trim(),
    term: (t.term||'').trim(),
    fullname: (t.fullname||'').trim(),
    meaning: (t.meaning||'').trim(),
    example: (t.example||'').trim(),
    category: (t.category||'Etc').trim() || 'Etc',
    longDesc,
    longdesc: longDesc,
    defaultFav,
    defaultfav: defaultFav,
    isDefaultFav: defaultFav.toLowerCase() === 'true' || defaultFav === '1' || defaultFav.toLowerCase() === 't'
  };
}

export async function loadTerms() {
  let rawTerms = [];
  let source = 'supabase';
  try {
    const { data, error } = await supabase.from('terms').select('*').order('term', { ascending: true }).limit(2000);
    if (error) throw error;
    if (!data || data.length===0) throw new Error('supabase empty');
    rawTerms = data;
  } catch (e) {
    console.warn('Supabase load failed, fallback to CSV', e.message);
    source = 'csv';
    try {
      const res = await fetch(CSV_PATH);
      if (!res.ok) throw new Error('csv fetch failed');
      const text = await res.text();
      rawTerms = parseCSV(text);
    } catch (e2) {
      console.error('CSV fallback failed', e2);
      rawTerms = [];
      source = 'empty';
    }
  }

  const allTerms = rawTerms.map(normalizeTerm).filter(t=>t.id && t.term && t.meaning);
  
  // 이전 UI 호환: categories를 {name, terms} 형태로 그룹화
  const grouped = {};
  for (const t of allTerms) {
    const cat = t.category || 'Etc';
    if (!grouped[cat]) grouped[cat]=[];
    grouped[cat].push(t);
  }
  const categories = Object.keys(grouped).sort().map(name => ({
    name,
    count: grouped[name].length,
    terms: grouped[name].sort((a,b)=>a.term.localeCompare(b.term))
  }));

  // Realtime 구독 (선택, 실패해도 무시)
  try {
    if (source==='supabase') {
      supabase.channel('terms-changes-ui').on('postgres_changes', { event: '*', schema: 'public', table: 'terms' }, () => {
        // 페이지 새로고침 없이도 다음 로드 시 반영되도록 이벤트만 발송
        window.dispatchEvent(new CustomEvent('glossary:terms-updated'));
      }).subscribe();
    }
  } catch {}

  return { categories, allTerms, source };
}
