// glossary/js/components.js - 이전 UI 복구 + Supabase 호환 (React.createElement 버전)
import React from 'react';

const h = React.createElement;

export function Header({ searchQuery, setSearchQuery, debouncedQuery, searchResults, onSelectTerm, totalTerms, totalCategories, isDark, toggleTheme, setMobileOpen, searchRef }) {
  return h('header', { className: 'sticky top-0 z-30 border-b bg-[var(--surface)]/90 backdrop-blur-xl' },
    h('div', { className: 'mx-auto max-w-[1680px] px-4 md:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4' },
      h('div', { className: 'flex items-center gap-3 min-w-0' },
        h('button', { onClick: ()=>setMobileOpen(v=>!v), className: 'lg:hidden h-9 w-9 rounded-full border grid place-items-center' }, '☰'),
        h('div', { className: 'h-9 w-9 rounded-xl bg-black text-white dark:bg-white dark:text-black grid place-items-center font-bold shrink-0' }, 'IT'),
        h('div', { className: 'min-w-0' },
          h('div', { className: 'font-extrabold text-[16px] leading-none' }, 'glossary'),
          h('div', { className: 'text-[11px] text-[var(--text-2)] mt-0.5' }, `${totalTerms} terms · ${totalCategories} categories · supabase`)
        )
      ),
      h('div', { className: 'flex items-center gap-2 flex-1 justify-end max-w-[600px]' },
        h('div', { className: 'relative flex-1' },
          h('input', {
            ref: searchRef,
            value: searchQuery,
            onChange: (e)=>setSearchQuery(e.target.value),
            placeholder: '용어, 뜻, 예시 검색...',
            className: 'w-full h-10 pl-4 pr-10 rounded-full border bg-[var(--surface-2)] outline-none text-[14px] focus:border-[var(--border-2)] focus:bg-[var(--surface)]'
          }),
          searchQuery && h('button', { onClick: ()=>setSearchQuery(''), className: 'absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[var(--surface-3)] grid place-items-center text-[11px]' }, '✕'),
          debouncedQuery && searchResults.length>0 && h('div', { className: 'absolute top-[44px] left-0 right-0 rounded-[16px] border bg-[var(--surface)] shadow-[var(--shadow-lg)] overflow-hidden max-h-[380px] overflow-y-auto z-50' },
            searchResults.map(t => h('button', {
              key: t.id,
              onClick: ()=>{ onSelectTerm(t); setSearchQuery(''); },
              className: 'w-full text-left px-4 py-3 hover:bg-[var(--surface-2)] border-b last:border-0 flex justify-between items-center'
            },
              h('div', null,
                h('div', { className: 'font-bold text-[14px]' }, t.term),
                h('div', { className: 'text-[12px] text-[var(--text-2)] truncate max-w-[320px]' }, t.meaning)
              ),
              h('span', { className: 'text-[10px] px-2 py-0.5 rounded-full border bg-[var(--surface-2)]' }, t.category)
            ))
          )
        ),
        h('button', { onClick: toggleTheme, className: 'h-10 w-10 rounded-full border bg-[var(--surface-2)] grid place-items-center text-[14px]' }, isDark ? '☀️' : '🌙'),
        h('a', { href: './admin.html', className: 'hidden md:grid h-10 px-4 rounded-full border bg-[var(--surface-2)] place-items-center text-[13px]' }, '관리자')
      )
    )
  );
}

export function Tabs({ activeTab, setActiveTab, favoritesCount }) {
  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'category', label: '카테고리' },
    { id: 'top30', label: 'TOP 30' },
    { id: 'favorites', label: `즐겨찾기 ${favoritesCount?`(${favoritesCount})`:''}` }
  ];
  return h('div', { className: 'border-b bg-[var(--surface)] sticky top-[64px] z-20' },
    h('div', { className: 'mx-auto max-w-[1680px] px-4 md:px-6 lg:px-8 h-[44px] flex items-center gap-1 overflow-x-auto' },
      tabs.map(t => h('button', {
        key: t.id,
        onClick: ()=>setActiveTab(t.id),
        className: `h-8 px-4 rounded-full text-[13px] font-medium whitespace-nowrap border ${activeTab===t.id ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text)]'}`
      }, t.label))
    )
  );
}

export function LeftSidebar({ categories, selectedCategories, toggleCategory, selectedTerm, onSelectTerm, searchActive, searchResults, isMobileOpen, setMobileOpen, getColor }) {
  const list = searchActive ? [{ name: '검색 결과', terms: searchResults }] : categories;
  return h('aside', { className: `${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[108px] left-0 z-30 lg:z-0 w-[320px] lg:w-[320px] h-[calc(100dvh-108px)] lg:h-[calc(100dvh-108px)] overflow-y-auto bg-[var(--surface)] lg:bg-transparent border-r lg:border-0 p-4 lg:p-0 lg:pr-4 transition-transform` },
    h('div', { className: 'space-y-5' },
      !searchActive && h('div', { className: 'space-y-2' },
        h('div', { className: 'text-[11px] font-bold text-[var(--text-3)] px-2' }, 'CATEGORY FILTER'),
        h('div', { className: 'flex flex-wrap gap-1.5' },
          categories.map(c => {
            const active = selectedCategories.has(c.name);
            return h('button', {
              key: c.name,
              onClick: ()=>toggleCategory(c.name),
              className: `text-[12px] px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${active ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'bg-[var(--surface-2)] hover:bg-[var(--surface-3)]'}`,
              style: active ? {} : { borderColor: getColor(c.name)+'30' }
            },
              h('span', { className: 'h-2 w-2 rounded-full', style: { background: getColor(c.name) } }),
              `${c.name} (${c.count})`
            );
          })
        )
      ),
      list.map(cat => h('div', { key: cat.name, className: 'space-y-1' },
        h('div', { className: 'flex items-center gap-2 px-2 py-2' },
          h('span', { className: 'h-2 w-2 rounded-full', style: { background: getColor(cat.name) } }),
          h('span', { className: 'text-[12px] font-bold' }, cat.name),
          h('span', { className: 'text-[11px] text-[var(--text-3)]' }, `· ${cat.terms.length}`)
        ),
        h('div', { className: 'space-y-0.5' },
          cat.terms.map(t => {
            const active = selectedTerm?.id === t.id;
            const filtered = selectedCategories.size>0 && !searchActive ? !selectedCategories.has(t.category) : false;
            if (filtered) return null;
            return h('button', {
              key: t.id,
              onClick: ()=>onSelectTerm(t),
              className: `w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 group ${active ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-[var(--surface-2)]'}`
            },
              h('span', { className: `text-[13px] ${active ? 'font-bold' : 'font-medium group-hover:font-semibold'} truncate` }, t.term),
              h('span', { className: `text-[10px] px-1.5 py-0.5 rounded-full border shrink-0 ${active ? 'border-white/20' : 'bg-[var(--surface)]'}` }, t.category.slice(0,3))
            );
          })
        )
      ))
    ),
    isMobileOpen && h('button', { onClick: ()=>setMobileOpen(false), className: 'lg:hidden fixed inset-0 bg-black/20 -z-10', style: { left: '320px' } })
  );
}

export function DetailView({ term, favorites, toggleFavorite, getColor, onSelectTerm, searchRef, copyState, setCopyState }) {
  if (!term) return h('div', { className: 'py-20 text-center text-[var(--text-3)]' }, '용어를 선택하세요');
  const isFav = favorites.has(term.term);
  const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text); setCopyState(key); setTimeout(()=>setCopyState(null), 1500); } catch {}
  };
  return h('div', { className: 'space-y-6' },
    h('div', { className: 'rounded-[24px] border bg-[var(--surface)] p-6 md:p-8 shadow-[var(--shadow)]' },
      h('div', { className: 'flex items-start justify-between gap-4' },
        h('div', { className: 'flex items-center gap-2' },
          h('span', { className: 'h-2.5 w-2.5 rounded-full', style: { background: getColor(term.category) } }),
          h('span', { className: 'text-[12px] px-2.5 py-1 rounded-full border bg-[var(--surface-2)]' }, term.category),
          h('span', { className: 'text-[11px] mono text-[var(--text-3)]' }, term.id)
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('button', { onClick: ()=>toggleFavorite(term.term), className: `h-9 w-9 rounded-full border grid place-items-center ${isFav ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-[var(--surface-2)]'}` }, isFav ? '★' : '☆'),
          h('button', { onClick: ()=>copy(term.term, 'term'), className: 'h-9 px-3 rounded-full border bg-[var(--surface-2)] text-[12px]' }, copyState==='term' ? '복사됨!' : '복사')
        )
      ),
      h('h1', { className: 'mt-5 text-[32px] md:text-[44px] font-extrabold leading-[1.1] tracking-tight' }, term.term),
      term.fullname && h('div', { className: 'mt-2 text-[15px] text-[var(--text-2)] mono' }, term.fullname),
      h('div', { className: 'mt-6 text-[17px] md:text-[19px] leading-[1.7] font-medium' }, term.meaning),
      term.example && h('div', { className: 'mt-6 rounded-[16px] border bg-[var(--surface-2)] p-4' },
        h('div', { className: 'text-[11px] font-bold text-[var(--text-3)] mb-2' }, 'EXAMPLE'),
        h('div', { className: 'text-[14px] leading-[1.6] whitespace-pre-wrap' }, term.example)
      ),
      term.longDesc && h('div', { className: 'mt-6' },
        h('div', { className: 'text-[11px] font-bold text-[var(--text-3)] mb-2' }, 'LONG DESCRIPTION'),
        h('div', { className: 'text-[14px] leading-[1.8] text-[var(--text-2)] whitespace-pre-wrap' }, term.longDesc)
      ),
      h('div', { className: 'mt-8 flex flex-wrap gap-2' },
        h('button', { onClick: ()=>copy(term.meaning, 'meaning'), className: 'h-9 px-4 rounded-full border bg-[var(--surface-2)] text-[13px]' }, copyState==='meaning' ? '뜻 복사됨' : '뜻 복사'),
        h('button', { onClick: ()=>{ searchRef?.current?.focus(); }, className: 'h-9 px-4 rounded-full border bg-[var(--surface)] text-[13px]' }, '검색으로 이동')
      )
    )
  );
}

export function RightSidebar({ related, top30, allTerms, selected, onSelect, favorites, onToggleFav }) {
  const topTerms = (() => {
    if (!top30 || top30.length===0) return allTerms.slice(0,8);
    return top30.map(name => allTerms.find(t=>t.term===name || t.id===name)).filter(Boolean).slice(0,8);
  })();
  return h('div', { className: 'space-y-5' },
    related && related.length>0 && h('div', { className: 'rounded-[20px] border bg-[var(--surface)] p-5' },
      h('div', { className: 'text-[11px] font-bold text-[var(--text-3)] mb-3' }, `RELATED IN ${selected?.category}`),
      h('div', { className: 'space-y-2' },
        related.map(t => h('button', { key: t.id, onClick: ()=>onSelect(t), className: 'w-full text-left p-3 rounded-xl border bg-[var(--surface-2)] hover:bg-[var(--surface-3)]' },
          h('div', { className: 'font-bold text-[13px]' }, t.term),
          h('div', { className: 'text-[11px] text-[var(--text-2)] truncate' }, t.meaning)
        ))
      )
    ),
    h('div', { className: 'rounded-[20px] border bg-[var(--surface)] p-5' },
      h('div', { className: 'text-[11px] font-bold text-[var(--text-3)] mb-3' }, 'TOP 30'),
      h('div', { className: 'space-y-1' },
        topTerms.map((t,idx) => h('button', { key: t.id, onClick: ()=>onSelect(t), className: 'w-full text-left px-3 py-2 rounded-xl hover:bg-[var(--surface-2)] flex items-center gap-3' },
          h('span', { className: 'text-[11px] font-bold text-[var(--text-3)] w-4' }, `${idx+1}`),
          h('span', { className: 'text-[13px] font-medium truncate' }, t.term)
        ))
      )
    ),
    favorites && favorites.size>0 && h('div', { className: 'rounded-[20px] border bg-[var(--surface)] p-5' },
      h('div', { className: 'text-[11px] font-bold text-[var(--text-3)] mb-3' }, `FAVORITES (${favorites.size})`),
      h('div', { className: 'flex flex-wrap gap-1.5' },
        Array.from(favorites).slice(0,20).map(name => {
          const t = allTerms.find(x=>x.term===name);
          if (!t) return null;
          return h('button', { key: t.id, onClick: ()=>onSelect(t), className: 'text-[11px] px-2.5 py-1 rounded-full border bg-[var(--surface-2)] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black' }, t.term);
        })
      )
    )
  );
}

export function CategoryGridView({ categories, onSelectCategory, getColor }) {
  return h('div', { className: 'space-y-4' },
    h('h2', { className: 'text-[20px] font-extrabold' }, '카테고리별 탐색'),
    h('div', { className: 'grid md:grid-cols-2 xl:grid-cols-3 gap-4' },
      categories.map(c => h('button', {
        key: c.name,
        onClick: ()=>onSelectCategory(c.name),
        className: 'text-left rounded-[20px] border bg-[var(--surface)] p-6 hover:shadow-[var(--shadow)] transition-shadow'
      },
        h('div', { className: 'flex items-center gap-2' },
          h('span', { className: 'h-2.5 w-2.5 rounded-full', style: { background: getColor(c.name) } }),
          h('span', { className: 'font-bold text-[15px]' }, c.name),
          h('span', { className: 'text-[11px] text-[var(--text-3)]' }, `· ${c.count}`)
        ),
        h('div', { className: 'mt-3 flex flex-wrap gap-1.5' },
          c.terms.slice(0,6).map(t => h('span', { key: t.id, className: 'text-[11px] px-2 py-1 rounded-full bg-[var(--surface-2)]' }, t.term)),
          c.count>6 && h('span', { className: 'text-[11px] text-[var(--text-3)]' }, `+${c.count-6}`)
        )
      ))
    )
  );
}

export function Top30View({ top30, allTerms, onSelectTerm }) {
  const terms = top30.map(name => allTerms.find(t=>t.term===name || t.id===name)).filter(Boolean);
  const list = terms.length>0 ? terms : allTerms.slice(0,30);
  return h('div', { className: 'space-y-4' },
    h('h2', { className: 'text-[20px] font-extrabold' }, 'TOP 30 용어'),
    h('div', { className: 'grid md:grid-cols-2 gap-3' },
      list.map((t,idx) => h('button', { key: t.id, onClick: ()=>onSelectTerm(t), className: 'text-left rounded-[16px] border bg-[var(--surface)] p-4 hover:shadow-[var(--shadow)] flex gap-3' },
        h('span', { className: 'text-[12px] font-bold text-[var(--text-3)] mt-1' }, `${idx+1}`),
        h('div', null,
          h('div', { className: 'font-bold text-[14px]' }, t.term),
          h('div', { className: 'text-[12px] text-[var(--text-2)] line-clamp-2' }, t.meaning)
        )
      ))
    )
  );
}

export function FavoritesView({ favorites, allTerms, onSelectTerm, onToggleFav }) {
  const favTerms = Array.from(favorites).map(name => allTerms.find(t=>t.term===name)).filter(Boolean);
  if (favTerms.length===0) return h('div', { className: 'py-20 text-center' },
    h('div', { className: 'text-[14px] text-[var(--text-3)]' }, '즐겨찾기가 없습니다. 용어 상세에서 ★를 눌러보세요.')
  );
  return h('div', { className: 'space-y-4' },
    h('h2', { className: 'text-[20px] font-extrabold' }, `즐겨찾기 ${favTerms.length}개`),
    h('div', { className: 'grid md:grid-cols-2 gap-3' },
      favTerms.map(t => h('div', { key: t.id, className: 'rounded-[16px] border bg-[var(--surface)] p-4 flex justify-between items-start gap-3' },
        h('button', { onClick: ()=>onSelectTerm(t), className: 'text-left flex-1' },
          h('div', { className: 'font-bold text-[14px]' }, t.term),
          h('div', { className: 'text-[12px] text-[var(--text-2)]' }, t.category),
          h('div', { className: 'text-[12px] text-[var(--text-2)] mt-1 line-clamp-2' }, t.meaning)
        ),
        h('button', { onClick: ()=>onToggleFav(t.term), className: 'h-8 w-8 rounded-full border bg-black text-white dark:bg-white dark:text-black grid place-items-center' }, '★')
      ))
    )
  );
}
