// glossary/js/components.js - v2 fixed: quick filters left of search, left=list right=detail+related, no duplicates
import React from 'react';
const h = React.createElement;

// Header with quick filters to the left of search - single source
export function Header({ searchQuery, setSearchQuery, onOpenCommand, totalTerms, activeFilter, setActiveFilter, selectedCategory, setSelectedCategory, isDark, toggleTheme, setMobileOpen }) {
  const filters = [
    { id: null, label: '전체', count: totalTerms },
    { id: 'top30', label: 'TOP 30', count: 30 },
    { id: 'favorites', label: '즐겨찾기', count: null }
  ];
  return h('header', { className: 'sticky top-0 z-30 border-b backdrop-blur-2xl', style: { background: 'color-mix(in srgb, var(--surface) 90%, transparent)', borderColor: 'var(--border)' } },
    h('div', { className: 'mx-auto max-w-[1680px] px-4 md:px-6 h-[68px] flex items-center gap-3' },
      // Logo
      h('div', { className: 'flex items-center gap-3 shrink-0' },
        h('button', { onClick: ()=>setMobileOpen(v=>!v), className: 'lg:hidden h-9 w-9 rounded-full border grid place-items-center', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, '☰'),
        h('div', { className: 'h-9 w-9 rounded-[12px] bg-black text-white dark:bg-white dark:text-black grid place-items-center font-bold text-[14px]' }, 'IT'),
        h('div', { className: 'hidden md:block min-w-0' },
          h('div', { className: 'font-bold text-[14px] leading-none tracking-tight' }, 'IT·AI 용어'),
          h('div', { className: 'text-[10px] mt-0.5', style: { color: 'var(--text-3)' } }, `${totalTerms} 용어`)
        )
      ),
      // Quick filters LEFT of search (as requested)
      h('div', { className: 'hidden md:flex items-center gap-1.5 shrink-0' },
        filters.map(f=>{
          const active = activeFilter===f.id && !selectedCategory;
          const isAll = f.id===null && !activeFilter && !selectedCategory;
          const isActive = f.id===null ? isAll : active;
          return h('button', {
            key: String(f.id),
            onClick: ()=>{
              if (f.id===null) { setActiveFilter(null); setSelectedCategory(null); setSearchQuery(''); }
              else { setActiveFilter(f.id); setSelectedCategory(null); setSearchQuery(''); }
            },
            className: `h-9 px-4 rounded-full border text-[13px] font-medium transition-all ${isActive ? 'bg-black text-white dark:bg-white dark:text-black border-black shadow-sm' : 'hover:bg-[var(--surface-2)]'}`,
            style: isActive ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' }
          }, f.label);
        })
      ),
      // Search
      h('div', { className: 'flex-1 max-w-[560px]' },
        h('button', {
          onClick: onOpenCommand,
          className: 'w-full h-10 pl-4 pr-3 rounded-full border flex items-center gap-2.5 text-left hover:shadow-sm transition-all',
          style: { background: 'var(--surface-2)', borderColor: 'var(--border)' }
        },
          h('span', { style: { color: 'var(--text-3)' } }, '🔍'),
          h('span', { className: 'flex-1 text-[13px] truncate', style: { color: searchQuery ? 'var(--text)' : 'var(--text-3)' } }, searchQuery || '용어, 뜻, 예시 검색... ⌘K'),
          searchQuery && h('span', { onClick: (e)=>{ e.stopPropagation(); setSearchQuery(''); }, className: 'h-6 w-6 rounded-full grid place-items-center text-[10px]', style: { background: 'var(--surface-3)' } }, '✕')
        )
      ),
      // Right actions
      h('div', { className: 'flex items-center gap-1.5 shrink-0' },
        h('button', { onClick: toggleTheme, className: 'h-9 w-9 rounded-full border grid place-items-center text-[13px]', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, isDark ? '☀️' : '🌙'),
        h('a', { href: './admin.html', className: 'hidden md:grid h-9 px-3.5 rounded-full border place-items-center text-[12px] font-medium', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, '관리자')
      )
    ),
    // Mobile filters row
    h('div', { className: 'md:hidden px-4 pb-3 flex gap-1.5 overflow-x-auto' },
      filters.map(f=>{
        const active = activeFilter===f.id && !selectedCategory;
        const isAll = f.id===null && !activeFilter && !selectedCategory;
        const isActive = f.id===null ? isAll : active;
        return h('button', {
          key: String(f.id),
          onClick: ()=>{ if (f.id===null) { setActiveFilter(null); setSelectedCategory(null); setSearchQuery(''); } else { setActiveFilter(f.id); setSelectedCategory(null); setSearchQuery(''); } },
          className: `h-8 px-3.5 rounded-full border text-[12px] font-medium whitespace-nowrap ${isActive ? 'bg-black text-white dark:bg-white dark:text-black border-black' : ''}`,
          style: isActive ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' }
        }, f.label);
      })
    )
  );
}

// Left: Term list - shows terms based on filter/category/search, clicking shows detail on right
export function TermList({ terms, selectedTerm, onSelectTerm, selectedCategory, activeFilter, categories, setSelectedCategory, setActiveFilter, setSearchQuery, getColor, searchQuery }) {
  const isFiltered = selectedCategory || activeFilter || searchQuery;
  
  return h('div', { className: 'w-full h-full flex flex-col' },
    // Category selector - secondary filter
    h('div', { className: 'p-3 border-b shrink-0', style: { borderColor: 'var(--border)', background: 'var(--surface-2)' } },
      h('div', { className: 'text-[10px] font-bold tracking-wider mb-2', style: { color: 'var(--text-3)' } }, '카테고리'),
      h('div', { className: 'flex flex-wrap gap-1' },
        h('button', {
          onClick: ()=>{ setSelectedCategory(null); setActiveFilter(null); setSearchQuery(''); },
          className: `text-[11px] px-2.5 py-1 rounded-full border ${!selectedCategory && !activeFilter && !searchQuery ? 'bg-black text-white dark:bg-white dark:text-black border-black' : ''}`,
          style: !selectedCategory && !activeFilter && !searchQuery ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' }
        }, '전체'),
        categories.slice(0, 12).map(c=>{
          const active = selectedCategory===c.name;
          return h('button', {
            key: c.name,
            onClick: ()=>{ setSelectedCategory(active ? null : c.name); setActiveFilter(null); setSearchQuery(''); },
            className: `text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-1 ${active ? 'bg-black text-white dark:bg-white dark:text-black border-black' : ''}`,
            style: active ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' }
          },
            h('span', { className: 'h-1.5 w-1.5 rounded-full', style: { background: active ? '#fff' : getColor(c.name) } }),
            `${c.name}`
          );
        })
      )
    ),
    // Term count + clear
    h('div', { className: 'px-4 py-2.5 flex items-center justify-between border-b shrink-0', style: { borderColor: 'var(--border)' } },
      h('div', { className: 'text-[11px] font-medium', style: { color: 'var(--text-2)' } },
        searchQuery ? `검색 ${terms.length}개` : activeFilter==='top30' ? `TOP 30` : activeFilter==='favorites' ? `즐겨찾기 ${terms.length}개` : selectedCategory ? `${selectedCategory} ${terms.length}개` : `전체 ${terms.length}개`
      ),
      isFiltered && h('button', { onClick: ()=>{ setSelectedCategory(null); setActiveFilter(null); setSearchQuery(''); }, className: 'text-[10px] underline', style: { color: 'var(--text-3)' } }, '초기화')
    ),
    // List
    h('div', { className: 'flex-1 overflow-y-auto' },
      terms.length===0 ? h('div', { className: 'p-8 text-center' },
        h('div', { className: 'text-[13px]', style: { color: 'var(--text-3)' } }, '용어가 없습니다'),
        h('div', { className: 'text-[11px] mt-1', style: { color: 'var(--text-3)' } }, '필터를 초기화해보세요')
      ) :
      h('div', { className: 'p-2 space-y-1' },
        terms.map(t=>{
          const active = selectedTerm?.id===t.id;
          return h('button', {
            key: t.id,
            onClick: ()=>onSelectTerm(t),
            className: `w-full text-left p-3 rounded-[14px] border transition-all ${active ? 'bg-black text-white dark:bg-white dark:text-black border-black shadow-sm' : 'border-transparent hover:bg-[var(--surface-2)] hover:border-[var(--border)]'}`,
          },
            h('div', { className: 'flex items-center gap-2 mb-1' },
              h('span', { className: 'h-1.5 w-1.5 rounded-full shrink-0', style: { background: active ? '#fff' : getColor(t.category) } }),
              h('span', { className: 'text-[10px] truncate', style: { color: active ? 'rgba(255,255,255,0.7)' : 'var(--text-3)' } }, t.category)
            ),
            h('div', { className: 'font-bold text-[13px] leading-tight' }, t.term),
            h('div', { className: 'text-[11px] mt-1 line-clamp-2 leading-[1.4]', style: { color: active ? 'rgba(255,255,255,0.75)' : 'var(--text-2)' } }, t.meaning)
          );
        })
      )
    )
  );
}

// Right: Detail + Related below - as requested
export function DetailPanel({ term, allTerms, favorites, onToggleFav, onSelectTerm, getColor }) {
  const [copied, setCopied] = React.useState(null);
  const related = React.useMemo(()=>{
    if (!term) return [];
    return allTerms.filter(t=> t.category===term.category && t.id!==term.id).slice(0, 6);
  }, [term, allTerms]);

  const copy = (text, type)=>{
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(()=>setCopied(null), 1500);
  };

  if (!term) return h('div', { className: 'h-full grid place-items-center p-12 text-center', style: { color: 'var(--text-3)' } },
    h('div', null,
      h('div', { className: 'text-[40px] mb-3' }, '📖'),
      h('div', { className: 'text-[14px] font-medium' }, '왼쪽에서 용어를 선택하세요'),
      h('div', { className: 'text-[12px] mt-1' }, '선택한 용어의 상세 내용과 관련 용어가 여기에 표시됩니다')
    )
  );

  return h('div', { className: 'h-full overflow-y-auto' },
    h('div', { className: 'p-6 md:p-8 max-w-[760px]' },
      // Breadcrumb + actions - smaller font as requested
      h('div', { className: 'flex items-start justify-between gap-3 mb-6' },
        h('div', { className: 'flex items-center gap-2' },
          h('span', { className: 'px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-[11px]', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } },
            h('span', { className: 'h-1.5 w-1.5 rounded-full', style: { background: getColor(term.category) } }),
            term.category
          ),
          h('span', { className: 'text-[11px]', style: { color: 'var(--text-3)' } }, '/'),
          h('span', { className: 'text-[11px] font-medium', style: { color: 'var(--text-2)' } }, term.term)
        ),
        h('div', { className: 'flex items-center gap-1.5' },
          h('button', { onClick: ()=>onToggleFav(term.term), className: `h-8 w-8 rounded-full border grid place-items-center text-[12px] transition-all ${favorites.has(term.term) ? 'bg-black text-white dark:bg-white dark:text-black border-black' : ''}`, style: favorites.has(term.term) ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' } }, favorites.has(term.term) ? '★' : '☆'),
          h('button', { onClick: ()=>copy(window.location.origin + window.location.pathname + '#' + term.id, 'link'), className: 'h-8 px-3 rounded-full border text-[11px] font-medium', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, copied==='link' ? '복사됨' : '링크')
        )
      ),
      // Title - closer to mockup, not too big
      h('div', { className: 'mb-8' },
        h('h1', { className: 'text-[30px] md:text-[36px] font-extrabold tracking-tight leading-[1.1]' }, term.term),
        term.fullname && term.fullname!==term.term && h('div', { className: 'text-[13px] mt-2 leading-[1.5]', style: { color: 'var(--text-2)' } }, term.fullname),
        h('div', { className: 'mt-4 text-[16px] md:text-[17px] leading-[1.6] font-medium p-4 rounded-[14px] border', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, term.meaning)
      ),
      // Example - code block with visual shape
      term.example && h('div', { className: 'mb-6 rounded-[14px] border overflow-hidden', style: { background: 'var(--surface)', borderColor: 'var(--border)' } },
        h('div', { className: 'flex items-center justify-between px-4 h-[40px] border-b', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } },
          h('div', { className: 'text-[10px] font-bold tracking-wider flex items-center gap-1.5', style: { color: 'var(--text-3)' } }, h('span', null, '◧'), '예시 코드'),
          h('button', { onClick: ()=>copy(term.example, 'example'), className: 'text-[10px] px-2.5 py-1 rounded-full border', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, copied==='example' ? '복사됨' : '복사')
        ),
        h('pre', { className: 'p-4 text-[13px] leading-[1.7] whitespace-pre-wrap mono overflow-x-auto', style: { background: '#0a0a0a', color: '#e5e5e5' } }, term.example)
      ),
      // Long Desc
      term.longDesc && h('div', { className: 'mb-8' },
        h('div', { className: 'text-[10px] font-bold tracking-wider mb-2.5', style: { color: 'var(--text-3)' } }, '상세 설명'),
        h('div', { className: 'text-[13px] leading-[1.75] whitespace-pre-wrap p-4 rounded-[14px] border', style: { background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-2)' } }, term.longDesc)
      ),
      // Copy actions
      h('div', { className: 'flex flex-wrap gap-2 mb-10' },
        h('button', { onClick: ()=>copy(term.meaning, 'meaning'), className: 'h-8 px-3.5 rounded-full border text-[11px] font-medium', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, copied==='meaning' ? '복사됨' : '뜻 복사'),
        term.example && h('button', { onClick: ()=>copy(term.example, 'example2'), className: 'h-8 px-3.5 rounded-full border text-[11px] font-medium', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, '예시 복사')
      ),
      // Related terms below detail - as requested
      related.length>0 && h('div', { className: 'pt-6 border-t', style: { borderColor: 'var(--border)' } },
        h('div', { className: 'flex items-center justify-between mb-3' },
          h('div', { className: 'text-[11px] font-bold tracking-wider', style: { color: 'var(--text-3)' } }, `관련 용어 · ${term.category}`),
          h('div', { className: 'text-[10px]', style: { color: 'var(--text-3)' } }, `${related.length}개`)
        ),
        h('div', { className: 'grid md:grid-cols-2 gap-2.5' },
          related.map(t=> h('button', { key: t.id, onClick: ()=>onSelectTerm(t), className: 'text-left p-3.5 rounded-[14px] border hover:shadow-sm transition-all group', style: { background: 'var(--surface)', borderColor: 'var(--border)' } },
            h('div', { className: 'flex items-center gap-2 mb-1' },
              h('span', { className: 'h-1.5 w-1.5 rounded-full group-hover:scale-125 transition-transform', style: { background: getColor(t.category) } }),
              h('span', { className: 'font-bold text-[12px]' }, t.term)
            ),
            h('div', { className: 'text-[11px] line-clamp-2 leading-[1.4]', style: { color: 'var(--text-2)' } }, t.meaning)
          ))
        )
      )
    )
  );
}

// Command Palette
export function CommandPalette({ isOpen, onClose, allTerms, categories, onSelectTerm, setFilter }) {
  const [query, setQuery] = React.useState('');
  React.useEffect(()=>{ if(isOpen) setQuery(''); }, [isOpen]);
  const results = React.useMemo(()=>{
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allTerms.filter(t=> t.term.toLowerCase().includes(q) || t.meaning.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).slice(0, 10);
  }, [query, allTerms]);

  if (!isOpen) return null;
  return h('div', { className: 'fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] p-4', onClick: onClose },
    h('div', { className: 'absolute inset-0 bg-black/30 backdrop-blur-sm' }),
    h('div', { className: 'relative w-full max-w-[640px] rounded-[20px] border shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden', style: { background: 'var(--surface)', borderColor: 'var(--border)' }, onClick: e=>e.stopPropagation() },
      h('div', { className: 'flex items-center gap-3 px-5 h-[52px] border-b', style: { borderColor: 'var(--border)' } },
        h('span', { style: { color: 'var(--text-3)' } }, '🔍'),
        h('input', { autoFocus: true, value: query, onChange: e=>setQuery(e.target.value), placeholder: '용어, 뜻, 카테고리 검색...', className: 'flex-1 bg-transparent outline-none text-[14px] placeholder:text-[var(--text-3)]' }),
        h('button', { onClick: onClose, className: 'h-7 w-7 rounded-full grid place-items-center text-[12px]', style: { background: 'var(--surface-2)' } }, '✕')
      ),
      h('div', { className: 'p-2.5 max-h-[420px] overflow-y-auto' },
        query.trim()==='' ? h('div', { className: 'space-y-3 py-1' },
          h('div', null,
            h('div', { className: 'text-[10px] font-bold px-3 mb-2', style: { color: 'var(--text-3)' } }, '빠른 필터'),
            h('div', { className: 'grid grid-cols-3 gap-2' },
              h('button', { onClick: ()=>{ setFilter(null); onClose(); }, className: 'text-left px-3 py-2.5 rounded-[12px] border', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, h('div', { className: 'font-medium text-[12px]' }, '전체'), h('div', { className: 'text-[10px]', style: { color: 'var(--text-3)' } }, '모든 용어')),
              h('button', { onClick: ()=>{ setFilter('top30'); onClose(); }, className: 'text-left px-3 py-2.5 rounded-[12px] border', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, h('div', { className: 'font-medium text-[12px]' }, 'TOP 30'), h('div', { className: 'text-[10px]', style: { color: 'var(--text-3)' } }, '핵심 용어')),
              h('button', { onClick: ()=>{ setFilter('favorites'); onClose(); }, className: 'text-left px-3 py-2.5 rounded-[12px] border', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, h('div', { className: 'font-medium text-[12px]' }, '즐겨찾기'), h('div', { className: 'text-[10px]', style: { color: 'var(--text-3)' } }, '저장한 용어'))
            )
          ),
          h('div', null,
            h('div', { className: 'text-[10px] font-bold px-3 mb-2', style: { color: 'var(--text-3)' } }, '카테고리'),
            h('div', { className: 'flex flex-wrap gap-1 px-1' },
              categories.map(c=> h('button', { key: c.name, onClick: ()=>{ setFilter(c.name); onClose(); }, className: 'text-[10px] px-2.5 py-1 rounded-full border', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, `${c.name} (${c.count})`))
            )
          )
        ) :
        h('div', null,
          results.length===0 ? h('div', { className: 'py-10 text-center text-[12px]', style: { color: 'var(--text-3)' } }, '검색 결과 없음') :
          h('div', { className: 'space-y-1' },
            results.map(t=> h('button', { key: t.id, onClick: ()=>{ onSelectTerm(t); onClose(); }, className: 'w-full text-left px-3 py-2.5 rounded-[12px] border flex items-center justify-between gap-3', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } },
              h('div', null, h('div', { className: 'font-bold text-[12px]' }, t.term), h('div', { className: 'text-[10px] truncate', style: { color: 'var(--text-2)' } }, t.meaning)),
              h('span', { className: 'text-[9px] px-2 py-0.5 rounded-full border', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, t.category)
            ))
          )
        )
      )
    )
  );
}
