// glossary/js/loader.js - Supabase 우선, CSV fallback
import { supabase } from './supabase.js';
import { CSV_PATH } from './config.js';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  // longDesc, defaultFav 대소문자 대응
  const idx = {};
  headers.forEach((h,i) => { idx[h.toLowerCase()] = i; });
  const get = (cols, ...names) => {
    for (const n of names) {
      const i = idx[n.toLowerCase()];
      if (i !== undefined && cols[i] !== undefined) {
        let v = cols[i].trim();
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1,-1).replace(/""/g, '"');
        return v;
      }
    }
    return '';
  };
  // 간단 CSV 파서 (따옴표 처리)
  const parseLine = (line) => {
    const cols = [];
    let cur = '', inQ = false;
    for (let i=0;i<line.length;i++) {
      const c = line[i];
      if (c === '"' ) {
        if (inQ && line[i+1]==='"') { cur+='"'; i++; }
        else inQ = !inQ;
      } else if (c===',' && !inQ) { cols.push(cur); cur=''; }
      else cur+=c;
    }
    cols.push(cur);
    return cols;
  };
  const terms = [];
  for (let i=1;i<lines.length;i++) {
    if (!lines[i].trim()) continue;
    const cols = parseLine(lines[i]);
    terms.push({
      id: get(cols, 'id'),
      term: get(cols, 'term'),
      fullname: get(cols, 'fullname'),
      meaning: get(cols, 'meaning'),
      example: get(cols, 'example'),
      category: get(cols, 'category'),
      longDesc: get(cols, 'longdesc', 'longDesc'),
      longdesc: get(cols, 'longdesc', 'longDesc'),
      defaultFav: get(cols, 'defaultfav', 'defaultFav'),
      defaultfav: get(cols, 'defaultfav', 'defaultFav')
    });
  }
  return terms;
}

function normalizeTerm(t) {
  // 소문자 통일 + camelCase 호환
  return {
    id: (t.id||'').trim(),
    term: (t.term||'').trim(),
    fullname: (t.fullname||'').trim(),
    meaning: (t.meaning||'').trim(),
    example: (t.example||'').trim(),
    category: (t.category||'Etc').trim(),
    longDesc: (t.longDesc || t.longdesc || '').trim(),
    longdesc: (t.longDesc || t.longdesc || '').trim(),
    defaultFav: (t.defaultFav || t.defaultfav || '').trim(),
    defaultfav: (t.defaultFav || t.defaultfav || '').trim()
  };
}

export async function loadTerms() {
  let allTerms = [];
  let source = 'supabase';
  try {
    const { data, error } = await supabase.from('terms').select('*').order('term', { ascending: true });
    if (error) throw error;
    if (!data || data.length===0) throw new Error('supabase empty');
    allTerms = data.map(normalizeTerm);
  } catch (e) {
    console.warn('Supabase load failed, fallback to CSV:', e.message);
    source = 'csv';
    try {
      const res = await fetch(CSV_PATH);
      if (!res.ok) throw new Error('csv fetch failed');
      const text = await res.text();
      allTerms = parseCSV(text).map(normalizeTerm);
    } catch (e2) {
      console.error('CSV fallback failed:', e2);
      allTerms = [];
      source = 'empty';
    }
  }
  const categories = [...new Set(allTerms.map(t=>t.category).filter(Boolean))].sort();
  return { allTerms, categories, source };
}

export { parseCSV, normalizeTerm };
