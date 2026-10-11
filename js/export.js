// glossary/js/export.js - 엑셀/CSV 내보내기/가져오기 (Supabase 호환, 소문자 파일명)
import { parseCSV, normalizeTerm as importedNormalize } from './loader.js';

// fallback normalizeTerm if import fails (안전장치)
function fallbackNormalize(t) {
  const longDesc = (t.longDesc || t.longdesc || '').trim();
  const defaultFav = (t.defaultFav || t.defaultfav || '').toString().trim();
  return {
    id: (t.id||'').trim(),
    term: (t.term||'').trim(),
    fullname: (t.fullname||'').trim(),
    meaning: (t.meaning||'').trim(),
    example: (t.example||'').trim(),
    category: (t.category||'Etc').trim() || 'Etc',
    longDesc, longdesc: longDesc,
    defaultFav, defaultfav: defaultFav
  };
}
const normalizeTerm = importedNormalize || fallbackNormalize;

export function generateCSVFromTerms(terms) {
  const headers = ['id','term','fullname','meaning','example','category','longDesc','defaultFav'];
  const esc = (v) => {
    const s = String(v||'').replace(/"/g, '""');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
  };
  const lines = [headers.join(',')];
  for (const t of terms) {
    const n = normalizeTerm(t);
    lines.push([
      esc(n.id), esc(n.term), esc(n.fullname), esc(n.meaning),
      esc(n.example), esc(n.category), esc(n.longDesc), esc(n.defaultFav)
    ].join(','));
  }
  return lines.join('\n');
}

export async function exportAllTerms(terms) {
  const xlsx = await import('xlsx');
  const data = terms.map(t => {
    const n = normalizeTerm(t);
    return {
      id: n.id, term: n.term, fullname: n.fullname, meaning: n.meaning,
      example: n.example, category: n.category, longDesc: n.longDesc, defaultFav: n.defaultFav
    };
  });
  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'terms');
  xlsx.writeFile(wb, `glossary-terms-${new Date().toISOString().slice(0,10)}.xlsx`);
}

export async function exportFavorites(allTerms, favSet) {
  const xlsx = await import('xlsx');
  const favs = allTerms.filter(t => favSet.has(t.term || t.id));
  const ws = xlsx.utils.json_to_sheet(favs);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'favorites');
  xlsx.writeFile(wb, `glossary-favorites-${new Date().toISOString().slice(0,10)}.xlsx`);
}

export async function importFromExcel(file) {
  const xlsx = await import('xlsx');
  const buf = await file.arrayBuffer();
  const wb = xlsx.read(buf, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const json = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  const terms = json.map(row => {
    const lower = {};
    Object.keys(row).forEach(k => lower[k.toLowerCase()] = row[k]);
    return normalizeTerm({
      id: lower.id || lower.term?.toLowerCase().replace(/\s+/g,'-') || '',
      term: lower.term || '',
      fullname: lower.fullname || '',
      meaning: lower.meaning || '',
      example: lower.example || '',
      category: lower.category || 'Etc',
      longDesc: lower.longdesc || lower.longDesc || '',
      defaultFav: lower.defaultfav || lower.defaultFav || ''
    });
  }).filter(t => t.term && t.meaning && t.category);
  const seen = new Set();
  for (const t of terms) {
    if (!t.id) t.id = t.term.toLowerCase().replace(/[^a-z0-9-]+/g,'-');
    if (seen.has(t.id.toLowerCase())) throw new Error(`엑셀 내 id 중복: ${t.id}`);
    seen.add(t.id.toLowerCase());
  }
  return terms;
}

export { parseCSV };
