
import * as XLSX from 'xlsx';
export function exportAllTerms(allTerms) {
  const data = allTerms.map(t=>({
    id: t.id,
    term: t.term,
    fullname: t.fullname,
    meaning: t.meaning,
    example: t.example,
    category: t.category,
    longDesc: t.longDesc || '',
    defaultFav: t.defaultFav || '',
    isDefaultFav: t.isDefaultFav ? 'TRUE' : 'FALSE'
  }));
  const ws = XLSX.utils.json_to_sheet(data, { header: ['id','term','fullname','meaning','example','category','longDesc','defaultFav','isDefaultFav'] });
  ws['!cols'] = [{wch:12},{wch:18},{wch:24},{wch:28},{wch:24},{wch:18},{wch:40},{wch:10},{wch:12}];
  ws['!autofilter'] = { ref: ws['!ref'] };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'glossary');
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
  XLSX.writeFile(wb, `it-ai-glossary-all-${date}.xlsx`);
}
export function exportFavorites(allTerms, favoritesSet) {
  const favList = Array.from(favoritesSet);
  const data = favList.map(termStr=>{
    const t = allTerms.find(x=>x.term===termStr);
    if(!t) return { term: termStr, meaning: '', category: '' };
    return {
      id: t.id,
      term: t.term,
      fullname: t.fullname,
      meaning: t.meaning,
      example: t.example,
      category: t.category,
      longDesc: t.longDesc || '',
      defaultFav: t.defaultFav || ''
    };
  });
  if(data.length===0) throw new Error('즐겨찾기가 비어있습니다');
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [{wch:12},{wch:18},{wch:24},{wch:28},{wch:24},{wch:18},{wch:40},{wch:10}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'favorites');
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
  XLSX.writeFile(wb, `it-ai-glossary-favorites-${date}.xlsx`);
}
export async function importFromExcel(file) {
  const ab = await file.arrayBuffer();
  const wb = XLSX.read(ab, { type: 'array' });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
  // validation
  if(json.length===0) throw new Error('엑셀에 데이터가 없습니다');
  const required = ['term','meaning','category'];
  const headers = Object.keys(json[0]||{});
  for(const r of required) {
    if(!headers.includes(r)) throw new Error(`필수 컬럼 누락: ${r} (현재: ${headers.join(',')})`);
  }
  // normalize
  const normalized = json.map((row, idx)=>{
    const term = (row.term||'').toString().trim();
    if(!term) throw new Error(`${idx+2}행: term이 비어있습니다`);
    return {
      id: (row.id||`import-${idx+1}`).toString().trim(),
      term: term,
      fullname: (row.fullname||term).toString().trim(),
      meaning: (row.meaning||'').toString().trim(),
      example: (row.example||'').toString().trim(),
      category: (row.category||'기타').toString().trim(),
      longDesc: (row.longDesc||'').toString().trim(),
      defaultFav: (row.defaultFav||'').toString().trim()
    };
  });
  return normalized;
}
export function generateCSVFromTerms(terms) {
  const header = ['id','term','fullname','meaning','example','category','longDesc','defaultFav'];
  const escape = (v)=>{
    const s = (v||'').toString();
    if(s.includes(',')||s.includes('"')||s.includes('\n')) return '"' + s.replace(/"/g,'""') + '"';
    return s;
  };
  const lines = [header.join(',')];
  for(const t of terms) {
    lines.push(header.map(h=>escape(t[h]||'')).join(','));
  }
  return lines.join('\n');
}
