// glossary/js/components.js - Modern, no duplicate content
import React from 'react';
const h = React.createElement;

// Header - single search source, command palette hint
export function Header({ searchQuery, setSearchQuery, onOpenCommand, totalTerms, totalCategories, isDark, toggleTheme, setMobileOpen, searchRef }) {
  return h('header', { className: 'sticky top-0 z-30 border-b backdrop-blur-2xl', style: { background: 'color-mix(in srgb, var(--surface) 85%, transparent)', borderColor: 'var(--border)' } },
    h('div', { className: 'mx-auto max-w-[1680px] px-4 md:px-6 h-[64px] flex items-center justify-between gap-4' },
      h('div', { className: 'flex items-center gap-3 min-w-0' },
        h('button', { onClick: ()=>setMobileOpen(v=>!v), className: 'lg:hidden h-9 w-9 rounded-full border grid place-items-center', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, '☰'),
        h('div', { className: 'h-9 w-9 rounded-[12px] bg-black text-white dark:bg-white dark:text-black grid place-items-center font-bold text-[14px] shrink-0' }, 'IT'),
        h('div', { className: 'min-w-0 hidden md:block' },
          h('div', { className: 'font-bold text-[15px] leading-none tracking-tight' }, 'IT·AI 용어 사전'),
          h('div', { className: 'text-[11px] mt-0.5', style: { color: 'var(--text-2)' } }, `${totalTerms} 용어 · ${totalCategories} 카테고리`)
        )
      ),
      h('div', { className: 'flex items-center gap-2 flex-1 justify-end max-w-[640px]' },
        h('button', {
          onClick: onOpenCommand,
          className: 'w-full h-10 pl-4 pr-3 rounded-full border flex items-center gap-3 text-left hover:shadow-sm transition-all group',
          style: { background: 'var(--surface-2)', borderColor: 'var(--border)' }
        },
          h('span', { className: 'text-[14px]', style: { color: 'var(--text-3)' } }, '🔍'),
          h('span', { className: 'flex-1 text-[13px] truncate', style: { color: 'var(--text-2)' } }, searchQuery || '용어, 뜻, 예시 검색...'),
          h('span', { className: 'hidden md:flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border', style: { background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-3)' } }, '⌘K')
        ),
        h('button', { onClick: toggleTheme, className: 'h-10 w-10 rounded-full border grid place-items-center text-[14px] shrink-0', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, isDark ? '☀️' : '🌙'),
        h('a', { href: './admin.html', className: 'hidden md:grid h-10 px-4 rounded-full border place-items-center text-[13px] font-medium hover:opacity-80', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, '관리자')
      )
    )
  );
}

// Command Palette - single search source
export function CommandPalette({ isOpen, onClose, searchQuery, setSearchQuery, allTerms, categories, onSelectTerm, setFilter, favorites }) {
  const [query, setQuery] = React.useState(searchQuery || '');
  React.useEffect(()=>{ setQuery(searchQuery||''); }, [searchQuery, isOpen]);
  const results = React.useMemo(()=>{
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allTerms.filter(t=> t.term.toLowerCase().includes(q) || t.meaning.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).slice(0, 8);
  }, [query, allTerms]);

  if (!isOpen) return null;
  return h('div', { className: 'fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] p-4', onClick: onClose },
    h('div', { className: 'absolute inset-0 bg-black/30 backdrop-blur-sm' }),
    h('div', { className: 'relative w-full max-w-[640px] rounded-[24px] border shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden animate-in', style: { background: 'var(--surface)', borderColor: 'var(--border)' }, onClick: e=>e.stopPropagation() },
      h('div', { className: 'flex items-center gap-3 px-6 h-[56px] border-b', style: { borderColor: 'var(--border)' } },
        h('span', { style: { color: 'var(--text-3)' } }, '🔍'),
        h('input', {
          autoFocus: true,
          value: query,
          onChange: e=>{ setQuery(e.target.value); setSearchQuery(e.target.value); },
          placeholder: '용어, 뜻, 카테고리 검색... (ESC로 닫기)',
          className: 'flex-1 bg-transparent outline-none text-[15px] placeholder:text-[var(--text-3)]',
        }),
        h('button', { onClick: onClose, className: 'h-7 w-7 rounded-full grid place-items-center', style: { background: 'var(--surface-2)' } }, '✕')
      ),
      h('div', { className: 'p-3 max-h-[400px] overflow-y-auto' },
        query.trim() === '' && h('div', { className: 'space-y-4 py-2' },
          h('div', null,
            h('div', { className: 'text-[11px] font-bold px-3 mb-2', style: { color: 'var(--text-3)' } }, '빠른 이동'),
            h('div', { className: 'grid grid-cols-2 gap-2' },
              h('button', { onClick: ()=>{ setFilter(null); onClose(); }, className: 'text-left px-4 py-3 rounded-[12px] border hover:opacity-80', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, h('div', { className: 'font-medium text-[13px]' }, '전체 보기'), h('div', { className: 'text-[11px]', style: { color: 'var(--text-2)' } }, '모든 용어')),
              h('button', { onClick: ()=>{ setFilter('top30'); onClose(); }, className: 'text-left px-4 py-3 rounded-[12px] border hover:opacity-80', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, h('div', { className: 'font-medium text-[13px]' }, 'TOP 30'), h('div', { className: 'text-[11px]', style: { color: 'var(--text-2)' } }, '핵심 용어만')),
              h('button', { onClick: ()=>{ setFilter('favorites'); onClose(); }, className: 'text-left px-4 py-3 rounded-[12px] border hover:opacity-80', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, h('div', { className: 'font-medium text-[13px]' }, `즐겨찾기 (${favorites.size})`), h('div', { className: 'text-[11px]', style: { color: 'var(--text-2)' } }, '내가 저장한 용어')),
              h('button', { onClick: ()=>{ setFilter(null); onClose(); setSearchQuery(''); }, className: 'text-left px-4 py-3 rounded-[12px] border hover:opacity-80', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, h('div', { className: 'font-medium text-[13px]' }, '카테고리 탐색'), h('div', { className: 'text-[11px]', style: { color: 'var(--text-2)' } }, `${categories.length}개 카테고리`))
            )
          ),
          h('div', null,
            h('div', { className: 'text-[11px] font-bold px-3 mb-2', style: { color: 'var(--text-3)' } }, '카테고리'),
            h('div', { className: 'flex flex-wrap gap-1.5 px-1' },
              categories.slice(0, 8).map(c=> h('button', { key: c.name, onClick: ()=>{ setFilter(c.name); onClose(); }, className: 'text-[11px] px-3 py-1.5 rounded-full border', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, `${c.name} (${c.count})`))
            )
          )
        ),
        query.trim() !== '' && h('div', null,
          h('div', { className: 'text-[11px] font-bold px-3 mb-2', style: { color: 'var(--text-3)' } }, `검색 결과 ${results.length}개`),
          results.length===0 ? h('div', { className: 'px-3 py-8 text-center text-[13px]', style: { color: 'var(--text-3)' } }, '검색 결과가 없습니다') :
          h('div', { className: 'space-y-1' },
            results.map(t=> h('button', { key: t.id, onClick: ()=>{ onSelectTerm(t); onClose(); }, className: 'w-full text-left px-3 py-3 rounded-[12px] border flex items-center justify-between gap-3 hover:opacity-80', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } },
              h('div', { className: 'min-w-0' },
                h('div', { className: 'font-bold text-[13px]' }, t.term),
                h('div', { className: 'text-[11px] truncate', style: { color: 'var(--text-2)' } }, t.meaning)
              ),
              h('span', { className: 'text-[10px] px-2 py-1 rounded-full border shrink-0', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, t.category)
            ))
          )
        )
      ),
      h('div', { className: 'px-6 py-3 border-t flex items-center justify-between text-[10px]', style: { borderColor: 'var(--border)', color: 'var(--text-3)', background: 'var(--surface-2)' } },
        h('span', null, '↑↓ 이동 · Enter 선택 · ESC 닫기'),
        h('span', null, 'Supabase Realtime')
      )
    )
  );
}

// Left Navigation - no duplicate filter chips, single source
export function LeftNav({ categories, selectedCategory, setSelectedCategory, activeFilter, setActiveFilter, selectedTerm, onSelectTerm, allTerms, favorites, totalTerms, getColor }) {
  const filteredTerms = React.useMemo(()=>{
    if (activeFilter==='top30') return allTerms.filter(t=> ['CRUD','REST','API','MVC','SQL','NoSQL','JWT','OAuth','ORM','CI/CD','Docker','Kubernetes','Git','HTTP','HTTPS','TCP/IP','DNS','CDN','AI','ML','LLM','RAG','Vector DB','Transformer','Prompt','Fine-tuning','React','Node.js','TypeScript','GraphQL'].includes(t.term));
    if (activeFilter==='favorites') return allTerms.filter(t=> favorites.has(t.term));
    if (selectedCategory) return allTerms.filter(t=> t.category===selectedCategory);
    return allTerms;
  }, [selectedCategory, activeFilter, allTerms, favorites]);

  return h('aside', { className: 'w-full lg:w-[300px] shrink-0' },
    h('div', { className: 'sticky top-[80px] space-y-6' },
      // Quick Filters - single source for TOP30 and Favorites (removed from right sidebar)
      h('div', null,
        h('div', { className: 'text-[11px] font-bold tracking-wider mb-3 px-1', style: { color: 'var(--text-3)' } }, '빠른 필터'),
        h('div', { className: 'space-y-1.5' },
          h('button', {
            onClick: ()=>{ setActiveFilter(null); setSelectedCategory(null); },
            className: `w-full text-left px-3 py-2.5 rounded-[12px] border flex items-center justify-between transition-all ${!activeFilter && !selectedCategory ? 'bg-black text-white dark:bg-white dark:text-black border-black' : ''}`,
            style: !activeFilter && !selectedCategory ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' }
          },
            h('span', { className: 'text-[13px] font-medium' }, '전체'),
            h('span', { className: 'text-[11px]', style: { color: !activeFilter && !selectedCategory ? 'rgba(255,255,255,0.6)' : 'var(--text-3)' } }, `${totalTerms}`)
          ),
          h('button', {
            onClick: ()=>{ setActiveFilter('top30'); setSelectedCategory(null); },
            className: `w-full text-left px-3 py-2.5 rounded-[12px] border flex items-center justify-between transition-all ${activeFilter==='top30' ? 'bg-black text-white dark:bg-white dark:text-black border-black' : ''}`,
            style: activeFilter==='top30' ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' }
          },
            h('span', { className: 'text-[13px] font-medium' }, 'TOP 30'),
            h('span', { className: 'text-[11px]', style: { color: activeFilter==='top30' ? 'rgba(255,255,255,0.6)' : 'var(--text-3)' } }, '핵심')
          ),
          h('button', {
            onClick: ()=>{ setActiveFilter('favorites'); setSelectedCategory(null); },
            className: `w-full text-left px-3 py-2.5 rounded-[12px] border flex items-center justify-between transition-all ${activeFilter==='favorites' ? 'bg-black text-white dark:bg-white dark:text-black border-black' : ''}`,
            style: activeFilter==='favorites' ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' }
          },
            h('span', { className: 'text-[13px] font-medium' }, '즐겨찾기'),
            h('span', { className: 'text-[11px]', style: { color: activeFilter==='favorites' ? 'rgba(255,255,255,0.6)' : 'var(--text-3)' } }, `${favorites.size}`)
          )
        )
      ),
      // Categories - single source (removed duplicate filter chips)
      h('div', null,
        h('div', { className: 'text-[11px] font-bold tracking-wider mb-3 px-1', style: { color: 'var(--text-3)' } }, `카테고리 (${categories.length})`),
        h('div', { className: 'space-y-1 max-h-[40vh] overflow-y-auto pr-1' },
          categories.map(c=>{
            const active = selectedCategory===c.name;
            return h('button', {
              key: c.name,
              onClick: ()=>{ setSelectedCategory(active ? null : c.name); setActiveFilter(null); },
              className: `w-full text-left px-3 py-2 rounded-[12px] flex items-center gap-2.5 transition-all ${active ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-[var(--surface-2)]'}`,
            },
              h('span', { className: 'h-2 w-2 rounded-full shrink-0', style: { background: active ? '#fff' : getColor(c.name) } }),
              h('span', { className: 'text-[13px] font-medium flex-1 truncate' }, c.name),
              h('span', { className: 'text-[11px]', style: { color: active ? 'rgba(255,255,255,0.6)' : 'var(--text-3)' } }, c.count)
            );
          })
        )
      ),
      // Term List - single list, no duplicate search results
      h('div', null,
        h('div', { className: 'text-[11px] font-bold tracking-wider mb-3 px-1 flex items-center justify-between', style: { color: 'var(--text-3)' } },
          h('span', null, activeFilter==='top30' ? 'TOP 30' : activeFilter==='favorites' ? '즐겨찾기' : selectedCategory || '전체 용어'),
          h('span', null, `${filteredTerms.length}`)
        ),
        h('div', { className: 'space-y-0.5 max-h-[35vh] overflow-y-auto pr-1' },
          filteredTerms.slice(0, 100).map(t=>{
            const active = selectedTerm?.id===t.id;
            return h('button', {
              key: t.id,
              onClick: ()=>onSelectTerm(t),
              className: `w-full text-left px-3 py-2.5 rounded-[12px] border transition-all ${active ? 'bg-black text-white dark:bg-white dark:text-black border-black shadow-sm' : 'border-transparent hover:bg-[var(--surface-2)] hover:border-[var(--border)]'}`,
            },
              h('div', { className: `font-medium text-[13px] truncate ${active ? '' : ''}` }, t.term),
              !active && h('div', { className: 'text-[11px] truncate mt-0.5', style: { color: 'var(--text-2)' } }, t.meaning)
            );
          }),
          filteredTerms.length>100 && h('div', { className: 'text-[11px] px-3 py-2', style: { color: 'var(--text-3)' } }, `+${filteredTerms.length-100}개 더... 검색으로 찾아보세요`)
        )
      )
    )
  );
}

// Term Detail - modern doc style
export function TermDetail({ term, allTerms, favorites, onToggleFav, onSelectTerm, getColor }) {
  const [copied, setCopied] = React.useState(null);
  const related = React.useMemo(()=>{
    if (!term) return [];
    return allTerms.filter(t=> t.category===term.category && t.id!==term.id).slice(0, 4);
  }, [term, allTerms]);

  const copy = (text, type)=>{
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(()=>setCopied(null), 1500);
  };

  if (!term) return h('div', { className: 'py-20 text-center', style: { color: 'var(--text-3)' } },
    h('div', { className: 'text-[48px] mb-4' }, '📚'),
    h('div', { className: 'text-[14px]' }, '왼쪽에서 용어를 선택하세요'),
    h('div', { className: 'text-[12px] mt-1' }, '또는 ⌘K로 검색')
  );

  return h('div', { className: 'min-w-0 animate-in' },
    // Breadcrumb + actions
    h('div', { className: 'flex items-start justify-between gap-4 mb-6' },
      h('div', { className: 'flex items-center gap-2 text-[11px]', style: { color: 'var(--text-3)' } },
        h('span', { className: 'px-2.5 py-1 rounded-full border flex items-center gap-1.5', style: { background: 'var(--surface)', borderColor: 'var(--border)' } },
          h('span', { className: 'h-2 w-2 rounded-full', style: { background: getColor(term.category) } }),
          term.category
        ),
        h('span', null, '/'),
        h('span', { className: 'font-medium', style: { color: 'var(--text-2)' } }, term.term)
      ),
      h('div', { className: 'flex items-center gap-1.5' },
        h('button', { onClick: ()=>onToggleFav(term.term), className: `h-9 w-9 rounded-full border grid place-items-center transition-all ${favorites.has(term.term) ? 'bg-black text-white dark:bg-white dark:text-black border-black' : ''}`, style: favorites.has(term.term) ? {} : { background: 'var(--surface)', borderColor: 'var(--border)' } }, favorites.has(term.term) ? '★' : '☆'),
        h('button', { onClick: ()=>copy(window.location.origin + window.location.pathname + '#' + term.id, 'link'), className: 'h-9 px-3 rounded-full border text-[12px] font-medium', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, copied==='link' ? '복사됨!' : '링크 복사')
      )
    ),
    // Title
    h('div', { className: 'mb-8' },
      h('h1', { className: 'text-[36px] md:text-[44px] font-extrabold tracking-tight leading-[0.9] mb-3' }, term.term),
      term.fullname && term.fullname!==term.term && h('div', { className: 'text-[15px] leading-[1.5]', style: { color: 'var(--text-2)' } }, term.fullname),
      h('div', { className: 'mt-6 text-[18px] md:text-[19px] leading-[1.6] font-medium' }, term.meaning)
    ),
    // Example - code block style
    term.example && h('div', { className: 'mb-8 rounded-[16px] border overflow-hidden', style: { background: 'var(--surface)', borderColor: 'var(--border)' } },
      h('div', { className: 'flex items-center justify-between px-5 h-[44px] border-b', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } },
        h('div', { className: 'text-[11px] font-bold tracking-wider', style: { color: 'var(--text-3)' } }, 'EXAMPLE'),
        h('button', { onClick: ()=>copy(term.example, 'example'), className: 'text-[11px] px-3 py-1 rounded-full border', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, copied==='example' ? '복사됨' : '복사')
      ),
      h('div', { className: 'p-5 text-[14px] leading-[1.7] whitespace-pre-wrap', style: { color: 'var(--text-2)' } }, term.example)
    ),
    // Long Description
    term.longDesc && h('div', { className: 'mb-8' },
      h('div', { className: 'text-[11px] font-bold tracking-wider mb-3', style: { color: 'var(--text-3)' } }, '상세 설명'),
      h('div', { className: 'text-[14px] leading-[1.8] whitespace-pre-wrap p-5 rounded-[16px] border', style: { background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-2)' } }, term.longDesc)
    ),
    // Actions
    h('div', { className: 'flex flex-wrap gap-2 pt-2' },
      h('button', { onClick: ()=>copy(term.meaning, 'meaning'), className: 'h-9 px-4 rounded-full border text-[13px] font-medium', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, copied==='meaning' ? '뜻 복사됨' : '뜻 복사'),
      term.example && h('button', { onClick: ()=>copy(term.example, 'example2'), className: 'h-9 px-4 rounded-full border text-[13px] font-medium', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, '예시 복사')
    ),
    // Related - only related, no TOP30/Favorites duplicate
    related.length>0 && h('div', { className: 'mt-12 pt-8 border-t', style: { borderColor: 'var(--border)' } },
      h('div', { className: 'text-[11px] font-bold tracking-wider mb-4', style: { color: 'var(--text-3)' } }, `${term.category}의 다른 용어`),
      h('div', { className: 'grid md:grid-cols-2 gap-3' },
        related.map(t=> h('button', { key: t.id, onClick: ()=>onSelectTerm(t), className: 'text-left p-4 rounded-[16px] border hover:shadow-sm transition-all', style: { background: 'var(--surface)', borderColor: 'var(--border)' } },
          h('div', { className: 'font-bold text-[13px] mb-1' }, t.term),
          h('div', { className: 'text-[12px] line-clamp-2', style: { color: 'var(--text-2)' } }, t.meaning)
        ))
      )
    )
  );
}

// Main layout - no Tabs, no duplicate sidebars
export function MainLayout({ children }) {
  return h('div', { className: 'mx-auto max-w-[1680px] px-4 md:px-6 py-6 md:py-8' }, children);
}
