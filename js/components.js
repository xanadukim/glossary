// glossary/js/components.js - v4: right-aligned filters+search, categories below Top
import React from 'react';
const h = React.createElement;

export function Header({ searchQuery, setSearchQuery, onOpenCommand, totalTerms, activeFilter, selectedCategory, setFilter, isDark, toggleTheme, setMobileOpen }) {
  const filters = [
    { id: null, label: '전체' },
    { id: 'top30', label: 'TOP 30' },
    { id: 'favorites', label: '즐겨찾기' }
  ];
  return h('header', { className: 'sticky top-0 z-30 border-b backdrop-blur-2xl', style: { background: 'color-mix(in srgb, var(--surface) 94%, transparent)', borderColor: 'var(--border)' } },
    h('div', { className: 'mx-auto max-w-[1680px] px-4 md:px-6 h-[56px] flex items-center justify-between gap-3' },
      // Left: logo
      h('div', { className: 'flex items-center gap-2.5 shrink-0' },
        h('button', { onClick: ()=>setMobileOpen(v=>!v), className: 'lg:hidden h-8 w-8 rounded-full border grid place-items-center text-[12px]', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, '☰'),
        h('div', { className: 'h-8 w-8 rounded-[10px] bg-black text-white dark:bg-white dark:text-black grid place-items-center font-bold text-[12px]' }, 'IT'),
        h('div', { className: 'hidden sm:block' },
          h('div', { className: 'font-bold text-[13px] leading-none tracking-tight' }, 'IT·AI 용어'),
          h('div', { className: 'text-[10px] mt-0.5', style: { color: 'var(--text-3)' } }, `${totalTerms}개`)
        )
      ),
      // Right aligned: filters + search + actions
      h('div', { className: 'flex items-center gap-2 md:gap-2.5 ml-auto' },
        h('div', { className: 'hidden md:flex items-center gap-1' },
          filters.map(f=>{
            const isAll = f.id===null && !activeFilter && !selectedCategory;
            const isActive = f.id===null ? isAll : activeFilter===f.id && !selectedCategory;
            return h('button', {
              key: String(f.id),
              onClick: ()=> setFilter(f.id),
              className: `h-8 px-3.5 rounded-full border text-[12px] font-medium transition-all ${isActive ? 'bg-black text-white dark:bg-white dark:text-black border-black shadow-sm' : 'hover:bg-[var(--surface-2)]'}`,
              style: isActive ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' }
            }, f.label);
          })
        ),
        h('button', {
          onClick: onOpenCommand,
          className: 'h-8 md:h-8 pl-3 pr-2.5 rounded-full border flex items-center gap-1.5 text-left hover:shadow-sm transition-all',
          style: { background: 'var(--surface-2)', borderColor: 'var(--border)' }
        },
          h('span', { className: 'text-[12px]', style: { color: 'var(--text-3)' } }, '🔍'),
          h('span', { className: 'hidden md:inline text-[12px] truncate max-w-[160px]', style: { color: searchQuery ? 'var(--text)' : 'var(--text-3)' } }, searchQuery || '검색 ⌘K'),
          h('span', { className: 'md:hidden text-[11px]', style: { color: 'var(--text-3)' } }, '검색'),
          searchQuery && h('span', { onClick: (e)=>{ e.stopPropagation(); setFilter(null); }, className: 'ml-1 h-5 w-5 rounded-full grid place-items-center text-[10px] bg-black text-white dark:bg-white dark:text-black' }, '✕')
        ),
        h('button', { onClick: toggleTheme, className: 'h-8 w-8 rounded-full border grid place-items-center text-[12px]', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, isDark ? '☀️' : '🌙'),
        h('a', { href: './admin.html', className: 'hidden md:grid h-8 px-3 rounded-full border place-items-center text-[11px] font-medium', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, '관리자')
      )
    ),
    h('div', { className: 'md:hidden px-4 pb-2 flex gap-1 overflow-x-auto' },
      filters.map(f=>{
        const isAll = f.id===null && !activeFilter && !selectedCategory;
        const isActive = f.id===null ? isAll : activeFilter===f.id && !selectedCategory;
        return h('button', {
          key: String(f.id),
          onClick: ()=> setFilter(f.id),
          className: `h-7 px-3 rounded-full border text-[11px] font-medium whitespace-nowrap ${isActive ? 'bg-black text-white border-black' : ''}`,
          style: isActive ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' }
        }, f.label);
      })
    )
  );
}

// NEW: Category bar below Top (as requested)
export function CategoryBar({ categories, selectedCategory, activeFilter, searchQuery, setFilter, getColor }) {
  const sorted = [...categories].sort((a,b)=> b.count - a.count || a.name.localeCompare(b.name));
  return h('div', { className: 'sticky top-[56px] z-20 border-b backdrop-blur-xl', style: { background: 'color-mix(in srgb, var(--surface) 90%, transparent)', borderColor: 'var(--border)' } },
    h('div', { className: 'mx-auto max-w-[1680px] px-4 md:px-6 h-[44px] flex items-center gap-1.5 overflow-x-auto scrollbar-none' },
      h('div', { className: 'flex items-center gap-1.5 shrink-0' },
        h('button', {
          onClick: ()=> setFilter(null),
          className: `h-7 px-3 rounded-full border text-[11px] font-medium whitespace-nowrap transition-all ${!selectedCategory && !activeFilter && !searchQuery ? 'bg-black text-white border-black shadow-sm' : 'hover:bg-[var(--surface-2)]'}`,
          style: !selectedCategory && !activeFilter && !searchQuery ? {} : { background: 'var(--surface-2)', borderColor: 'var(--border)' }
        }, `전체 ${categories.reduce((s,c)=>s+c.count,0)}`),
        sorted.map(c=>{
          const active = selectedCategory===c.name;
          return h('button', {
            key: c.name,
            onClick: ()=> setFilter(active ? null : c.name),
            className: `h-7 px-3 rounded-full border flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap transition-all ${active ? 'bg-black text-white border-black shadow-sm' : 'hover:bg-[var(--surface-2)]'}`,
            style: active ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' }
          },
            h('span', { className: 'h-1.5 w-1.5 rounded-full', style: { background: active ? '#fff' : getColor(c.name) } }),
            `${c.name}`,
            h('span', { className: 'text-[10px] opacity-60' }, c.count)
          );
        })
      )
    )
  );
}

export function TermList({ terms, selectedTerm, onSelectTerm, setFilter, getColor, searchQuery, selectedCategory, activeFilter }) {
  return h('div', { className: 'w-full h-full flex flex-col' },
    h('div', { className: 'px-3 py-2.5 flex items-center justify-between border-b shrink-0', style: { borderColor: 'var(--border)', background: 'var(--surface-2)' } },
      h('div', { className: 'text-[11px] font-bold', style: { color: 'var(--text-2)' } },
        searchQuery ? `검색: ${searchQuery} (${terms.length})` : activeFilter==='top30' ? `TOP 30 (${terms.length})` : activeFilter==='favorites' ? `즐겨찾기 (${terms.length})` : selectedCategory ? `${selectedCategory} (${terms.length})` : `전체 ${terms.length}개`
      ),
      (selectedCategory || activeFilter || searchQuery) && h('button', { onClick: ()=> setFilter(null), className: 'text-[10px] px-2 py-0.5 rounded-full border', style: { background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-3)' } }, '초기화')
    ),
    h('div', { className: 'flex-1 overflow-y-auto' },
      terms.length===0 ? h('div', { className: 'p-8 text-center' },
        h('div', { className: 'text-[12px] font-medium', style: { color: 'var(--text-2)' } }, '결과 없음'),
        h('button', { onClick: ()=> setFilter(null), className: 'mt-3 h-8 px-3 rounded-full border text-[11px]', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, '전체 보기')
      ) :
      h('div', { className: 'p-2 space-y-1' },
        terms.map(t=>{
          const active = selectedTerm?.id===t.id;
          return h('button', {
            key: t.id,
            onClick: ()=> onSelectTerm(t),
            className: `w-full text-left p-3 rounded-[12px] border transition-all text-left ${active ? 'bg-black text-white border-black shadow-[0_2px_8px_rgba(0,0,0,0.15)]' : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-2)] hover:shadow-sm'}`,
          },
            h('div', { className: 'flex items-center gap-1.5 mb-1' },
              h('span', { className: 'h-1.5 w-1.5 rounded-full shrink-0', style: { background: active ? '#fff' : getColor(t.category) } }),
              h('span', { className: 'text-[10px] truncate', style: { color: active ? 'rgba(255,255,255,0.65)' : 'var(--text-3)' } }, t.category)
            ),
            h('div', { className: 'font-bold text-[13px] leading-[1.2]' }, t.term),
            h('div', { className: 'text-[11px] mt-1 leading-[1.4] line-clamp-2', style: { color: active ? 'rgba(255,255,255,0.7)' : 'var(--text-2)' } }, t.meaning)
          );
        })
      )
    )
  );
}

export function DetailPanel({ term, allTerms, favorites, onToggleFav, onSelectTerm, getColor }) {
  const [copied, setCopied] = React.useState(null);
  const related = React.useMemo(()=>{
    if (!term) return [];
    return allTerms.filter(t=> t.category===term.category && t.id!==term.id).sort((a,b)=> a.term.localeCompare(b.term)).slice(0, 6);
  }, [term, allTerms]);
  const copy = (text, type)=>{ navigator.clipboard.writeText(text); setCopied(type); setTimeout(()=>setCopied(null), 1500); };
  if (!term) return h('div', { className: 'h-full grid place-items-center p-12 text-center', style: { color: 'var(--text-3)' } },
    h('div', null, h('div', { className: 'text-[36px] mb-3' }, '📖'), h('div', { className: 'text-[13px] font-medium' }, '왼쪽에서 용어를 선택하세요'))
  );
  return h('div', { className: 'h-full overflow-y-auto' },
    h('div', { className: 'p-5 md:p-7 w-full' },
      h('div', { className: 'flex items-center justify-between gap-3 mb-5' },
        h('div', { className: 'flex items-center gap-2 min-w-0' },
          h('span', { className: 'px-2.5 py-1 rounded-full border flex items-center gap-1.5 text-[11px] font-medium shrink-0', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } },
            h('span', { className: 'h-1.5 w-1.5 rounded-full', style: { background: getColor(term.category) } }), term.category
          ),
          h('span', { className: 'text-[11px] truncate', style: { color: 'var(--text-3)' } }, `#${term.id}`)
        ),
        h('div', { className: 'flex items-center gap-1.5 shrink-0' },
          h('button', { onClick: ()=>onToggleFav(term.term), className: `h-8 w-8 rounded-full border grid place-items-center text-[13px] ${favorites.has(term.term) ? 'bg-black text-white border-black' : ''}`, style: favorites.has(term.term) ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' } }, favorites.has(term.term) ? '★' : '☆'),
          h('button', { onClick: ()=>copy(window.location.origin + window.location.pathname + '#' + term.id, 'link'), className: 'h-8 px-3 rounded-full border text-[11px] font-medium', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, copied==='link' ? '복사됨' : '링크')
        )
      ),
      h('div', { className: 'flex items-baseline gap-3 mb-2' },
        h('h1', { className: 'text-[32px] md:text-[40px] font-extrabold tracking-tight leading-[0.95]' }, term.term),
        h('span', { className: 'text-[13px]', style: { color: 'var(--text-3)' } }, term.id)
      ),
      term.fullname && term.fullname!==term.term && h('div', { className: 'text-[13px] mb-3', style: { color: 'var(--text-2)' } }, term.fullname),
      h('div', { className: 'mt-4 p-4 rounded-[14px] border text-[15px] leading-[1.6] font-medium', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, term.meaning),
      term.longDesc && term.longDesc.trim() && h('div', { className: 'mt-3 p-4 rounded-[14px] border text-[13px] leading-[1.7] whitespace-pre-wrap', style: { background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' } }, term.longDesc),
      h('div', { className: 'mt-5' },
        h('div', { className: 'flex items-center justify-between mb-2' },
          h('div', { className: 'text-[11px] font-bold tracking-wider', style: { color: 'var(--text-3)' } }, '예시'),
          h('button', { onClick: ()=>copy(term.example || term.meaning, 'copy'), className: 'text-[11px] px-2.5 py-1 rounded-full border', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, copied==='copy' ? '복사됨' : '복사')
        ),
        h('div', { className: 'rounded-[14px] overflow-hidden border', style: { borderColor: 'var(--border)' } },
          h('pre', { className: 'p-4 text-[13px] leading-[1.6] whitespace-pre-wrap mono', style: { background: '#111113', color: '#e4e4e7' } }, term.example || term.meaning)
        )
      ),
      related.length>0 && h('div', { className: 'mt-8' },
        h('div', { className: 'text-[11px] font-bold tracking-wider mb-3', style: { color: 'var(--text-3)' } }, `관련 · ${term.category} (${related.length})`),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-2.5' },
          related.map(t=> h('button', { key: t.id, onClick: ()=>onSelectTerm(t), className: 'text-left p-3.5 rounded-[14px] border text-left hover:shadow-sm transition-all', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } },
            h('div', { className: 'flex items-center gap-1.5 mb-1' }, h('span', { className: 'h-1.5 w-1.5 rounded-full', style: { background: getColor(t.category) } }), h('span', { className: 'font-bold text-[12px]' }, t.term)),
            h('div', { className: 'text-[11px] leading-[1.4] line-clamp-2', style: { color: 'var(--text-2)' } }, t.meaning)
          ))
        )
      )
    )
  );
}

export function CommandPalette({ isOpen, onClose, allTerms, categories, onSelectTerm, setFilter }) {
  const [query, setQuery] = React.useState('');
  React.useEffect(()=>{ if(isOpen) setQuery(''); }, [isOpen]);
  const results = React.useMemo(()=>{
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allTerms.filter(t=> t.term.toLowerCase().includes(q) || t.meaning.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).slice(0, 10);
  }, [query, allTerms]);
  if (!isOpen) return null;
  return h('div', { className: 'fixed inset-0 z-[100] flex items-start justify-center pt-[16vh] p-4', onClick: onClose },
    h('div', { className: 'absolute inset-0 bg-black/40 backdrop-blur-sm' }),
    h('div', { className: 'relative w-full max-w-[560px] rounded-[20px] border shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden', style: { background: 'var(--surface)', borderColor: 'var(--border)' }, onClick: e=>e.stopPropagation() },
      h('div', { className: 'flex items-center gap-3 px-4 h-[48px] border-b', style: { borderColor: 'var(--border)' } },
        h('span', { className: 'text-[13px]', style: { color: 'var(--text-3)' } }, '🔍'),
        h('input', { autoFocus: true, value: query, onChange: e=>setQuery(e.target.value), placeholder: '검색...', className: 'flex-1 bg-transparent outline-none text-[13px] placeholder:text-[var(--text-3)]' }),
        h('button', { onClick: onClose, className: 'h-6 w-6 rounded-full grid place-items-center text-[11px]', style: { background: 'var(--surface-2)' } }, '✕')
      ),
      h('div', { className: 'p-2 max-h-[400px] overflow-y-auto' },
        query.trim()==='' ? h('div', { className: 'space-y-3 py-1' },
          h('div', { className: 'grid grid-cols-3 gap-2' },
            h('button', { onClick: ()=>{ setFilter(null); onClose(); }, className: 'p-3 rounded-[12px] border text-left', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, h('div', { className: 'text-[12px] font-bold' }, '전체')),
            h('button', { onClick: ()=>{ setFilter('top30'); onClose(); }, className: 'p-3 rounded-[12px] border text-left', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, h('div', { className: 'text-[12px] font-bold' }, 'TOP 30')),
            h('button', { onClick: ()=>{ setFilter('favorites'); onClose(); }, className: 'p-3 rounded-[12px] border text-left', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, h('div', { className: 'text-[12px] font-bold' }, '즐겨찾기'))
          )
        ) :
        h('div', { className: 'space-y-1' },
          results.map(t=> h('button', { key: t.id, onClick: ()=>{ onSelectTerm(t); onClose(); }, className: 'w-full text-left px-3 py-2.5 rounded-[12px] border flex justify-between gap-2', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } },
            h('div', null, h('div', { className: 'font-bold text-[12px]' }, t.term), h('div', { className: 'text-[10px] truncate', style: { color: 'var(--text-2)' } }, t.meaning))
          ))
        )
      )
    )
  );
}
