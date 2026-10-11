export async function loadTerms() {
  const res = await fetch('./terms.csv');
  let text = await res.text();
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const lines = text.trim().split('\n');
  const header = lines[0].split(',').map(h=>h.trim());
  const idx = { id: header.indexOf('id'), term: header.indexOf('term'), fullname: header.indexOf('fullname'), meaning: header.indexOf('meaning'), example: header.indexOf('example'), category: header.indexOf('category'), longDesc: header.indexOf('longDesc'), defaultFav: header.indexOf('defaultFav') };
  const terms = [];
  for (let i=1;i<lines.length;i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const row = parseCSVLine(line);
    if (row.length < 6) continue;
    const get = (key) => {
      const pos = idx[key];
      if (pos === -1 || pos >= row.length) return '';
      const v = row[pos];
      if (v === undefined || v === null) return '';
      const t = v.trim();
      if (t === '' || t.toUpperCase() === 'NULL') return '';
      return t;
    };
    const t = { id: get('id'), term: get('term'), fullname: get('fullname'), meaning: get('meaning'), example: get('example'), category: get('category'), longDesc: get('longDesc'), defaultFav: get('defaultFav') };
    if (t.category === '백엔드·아키텍처') t.category = '백엔드';
    if (t.category === '배포·운영·품질') t.category = '배포·운영';
    const favRaw = (t.defaultFav || '').toLowerCase();
    t.isDefaultFav = ['true','1','yes','y','t'].includes(favRaw);
    terms.push(t);
  }
  if (!terms.find(t=>t.term==='CRUD')) {
    terms.unshift({ id: 'crud', term: 'CRUD', fullname: 'Create Read Update Delete', meaning: '데이터를 다루는 4가지 기본 연산', example: '데이터베이스 기본 사이클', category: '데이터베이스·SQL', longDesc: '', defaultFav: '', isCRUD: true, isDefaultFav: false });
  }
  const map = new Map();
  terms.forEach(t=>{ if (!map.has(t.category)) map.set(t.category, []); map.get(t.category).push(t); });
  const order = ["Git·GitHub","개발 기본","프로그래밍 개념","웹 공통·HTTP","프론트엔드","백엔드","데이터베이스·SQL","배포·운영","프로젝트·협업","AI 기초","AI 활용·개발","AI 정책·윤리"];
  const categories = Array.from(map.entries()).map(([name, tlist])=>({ name, terms: tlist }));
  categories.sort((a,b)=>{ const ia=order.indexOf(a.name), ib=order.indexOf(b.name); if(ia===-1&&ib===-1) return a.name.localeCompare(b.name); if(ia===-1) return 1; if(ib===-1) return -1; return ia-ib; });
  return { categories, allTerms: terms };
}
function parseCSVLine(line) {
  const result=[]; let cur=''; let inQuotes=false;
  for (let i=0;i<line.length;i++) {
    const c=line[i];
    if (c=='"') { if (inQuotes && line[i+1]=='"') { cur+='"'; i++; } else { inQuotes=!inQuotes; } }
    else if (c===',' && !inQuotes) { result.push(cur); cur=''; }
    else { cur+=c; }
  }
  result.push(cur);
  return result.map(s=>s.trim());
}
