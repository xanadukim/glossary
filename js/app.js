// glossary/js/app.js - Modern, no duplicate content
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { loadTerms } from './loader.js';
import { getCategoryColor, TOP30, LOCAL_STORAGE_KEYS } from './config.js';
import { Header, CommandPalette, LeftNav, TermDetail, MainLayout } from './components.js';

const h = React.createElement;

function App() {
  const [allTerms, setAllTerms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null); // null, 'top30', 'favorites'
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const searchRef = useRef(null);

  // Load terms
  useEffect(()=>{
    (async()=>{
      const { allTerms: loaded, categories: cats } = await loadTerms();
      setAllTerms(loaded);
      setCategories(cats);
      // Default select first term or from hash
      const hash = window.location.hash.replace('#','');
      const fromHash = hash ? loaded.find(t=>t.id===hash) : null;
      if (fromHash) setSelectedTerm(fromHash);
      else if (loaded.length>0) setSelectedTerm(loaded[0]);
    })();
  }, []);

  // Favorites from localStorage
  useEffect(()=>{
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.favorites);
      if (saved) setFavorites(new Set(JSON.parse(saved)));
      else {
        // Default favs from isDefaultFav
        const defaults = allTerms.filter(t=>t.isDefaultFav).map(t=>t.term);
        if (defaults.length>0) {
          const set = new Set(defaults);
          setFavorites(set);
          localStorage.setItem(LOCAL_STORAGE_KEYS.favorites, JSON.stringify([...set]));
        }
      }
    } catch {}
  }, [allTerms]);

  useEffect(()=>{
    try { localStorage.setItem(LOCAL_STORAGE_KEYS.favorites, JSON.stringify([...favorites])); } catch {}
  }, [favorites]);

  // Theme
  useEffect(()=>{
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.theme);
    const dark = saved ? saved==='dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);
  const toggleTheme = ()=>{
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem(LOCAL_STORAGE_KEYS.theme, next?'dark':'light');
  };

  // Command palette keyboard
  useEffect(()=>{
    const onKey = (e)=>{
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='k') {
        e.preventDefault();
        setIsCommandOpen(v=>!v);
      }
      if (e.key==='Escape' && isCommandOpen) setIsCommandOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
  }, [isCommandOpen]);

  // Hash navigation
  useEffect(()=>{
    if (selectedTerm) {
      history.replaceState(null, '', '#' + selectedTerm.id);
    }
  }, [selectedTerm]);

  // Search filtering for center list
  const searchResults = useMemo(()=>{
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allTerms.filter(t=> t.term.toLowerCase().includes(q) || t.meaning.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).slice(0, 20);
  }, [searchQuery, allTerms]);

  const onSelectTerm = (t)=>{
    setSelectedTerm(t);
    setIsMobileOpen(false);
    setIsCommandOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onToggleFav = (termName)=>{
    setFavorites(prev=>{
      const next = new Set(prev);
      if (next.has(termName)) next.delete(termName);
      else next.add(termName);
      return next;
    });
  };

  const setFilter = (filter)=>{
    // filter: null, 'top30', 'favorites', or category name
    if (filter===null) { setActiveFilter(null); setSelectedCategory(null); }
    else if (filter==='top30' || filter==='favorites') { setActiveFilter(filter); setSelectedCategory(null); }
    else { setSelectedCategory(filter); setActiveFilter(null); }
    setIsMobileOpen(false);
  };

  // For left nav term list, when search active show search results only in center, not duplicate in left
  const isSearchActive = searchQuery.trim().length>0;

  return h('div', { className: 'min-h-screen', style: { background: 'var(--bg)' } },
    h(Header, {
      searchQuery,
      setSearchQuery,
      onOpenCommand: ()=>setIsCommandOpen(true),
      totalTerms: allTerms.length,
      totalCategories: categories.length,
      isDark,
      toggleTheme,
      setMobileOpen: setIsMobileOpen,
      searchRef
    }),
    h(CommandPalette, {
      isOpen: isCommandOpen,
      onClose: ()=>setIsCommandOpen(false),
      searchQuery,
      setSearchQuery,
      allTerms,
      categories,
      onSelectTerm,
      setFilter,
      favorites
    }),
    h(MainLayout, null,
      h('div', { className: 'flex flex-col lg:flex-row gap-8 lg:gap-10' },
        // Left - hidden on mobile unless open
        h('div', { className: `${isMobileOpen ? 'fixed inset-0 z-40 p-4 pt-[72px] bg-[var(--bg)] overflow-y-auto lg:static lg:p-0 lg:bg-transparent lg:overflow-visible' : 'hidden lg:block'} lg:w-[300px] shrink-0` },
          isMobileOpen && h('button', { onClick: ()=>setIsMobileOpen(false), className: 'lg:hidden mb-4 h-9 px-4 rounded-full border text-[13px]', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, '✕ 닫기'),
          h(LeftNav, {
            categories,
            selectedCategory,
            setSelectedCategory: (cat)=>{ setSelectedCategory(cat); setActiveFilter(null); },
            activeFilter,
            setActiveFilter: (f)=>{ setActiveFilter(f); if(f) setSelectedCategory(null); },
            selectedTerm,
            onSelectTerm,
            allTerms: isSearchActive ? searchResults : allTerms,
            favorites,
            totalTerms: allTerms.length,
            getColor: getCategoryColor
          })
        ),
        // Center - single source, no duplicate lists
        h('div', { className: 'flex-1 min-w-0' },
          isSearchActive ?
            h('div', { className: 'space-y-4 animate-in' },
              h('div', { className: 'flex items-center justify-between' },
                h('h2', { className: 'text-[20px] font-bold' }, `검색 결과 ${searchResults.length}개`),
                h('button', { onClick: ()=>setSearchQuery(''), className: 'text-[12px] px-3 py-1.5 rounded-full border', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, '검색 초기화')
              ),
              h('div', { className: 'grid md:grid-cols-2 gap-3' },
                searchResults.map(t=> h('button', { key: t.id, onClick: ()=>onSelectTerm(t), className: 'text-left p-4 rounded-[16px] border hover:shadow-sm transition-all text-left', style: { background: 'var(--surface)', borderColor: 'var(--border)' } },
                  h('div', { className: 'flex items-center gap-2 mb-1' },
                    h('span', { className: 'h-2 w-2 rounded-full', style: { background: getCategoryColor(t.category) } }),
                    h('span', { className: 'text-[11px]', style: { color: 'var(--text-3)' } }, t.category)
                  ),
                  h('div', { className: 'font-bold text-[14px]' }, t.term),
                  h('div', { className: 'text-[12px] mt-1 line-clamp-2', style: { color: 'var(--text-2)' } }, t.meaning)
                ))
              )
            )
          :
          activeFilter==='top30' ?
            h('div', { className: 'space-y-4 animate-in' },
              h('div', null,
                h('h2', { className: 'text-[28px] font-extrabold tracking-tight' }, 'TOP 30'),
                h('div', { className: 'text-[13px] mt-1', style: { color: 'var(--text-2)' } }, '가장 중요한 핵심 용어 30개')
              ),
              h('div', { className: 'grid md:grid-cols-2 gap-3' },
                TOP30.map((name, idx)=>{
                  const t = allTerms.find(x=>x.term===name || x.id===name);
                  if (!t) return null;
                  return h('button', { key: t.id, onClick: ()=>onSelectTerm(t), className: 'text-left p-4 rounded-[16px] border hover:shadow-sm flex gap-3 transition-all', style: { background: 'var(--surface)', borderColor: 'var(--border)' } },
                    h('span', { className: 'text-[11px] font-bold mt-1', style: { color: 'var(--text-3)' } }, `${idx+1}`),
                    h('div', null,
                      h('div', { className: 'font-bold text-[14px]' }, t.term),
                      h('div', { className: 'text-[11px] mb-1', style: { color: 'var(--text-3)' } }, t.category),
                      h('div', { className: 'text-[12px] line-clamp-2', style: { color: 'var(--text-2)' } }, t.meaning)
                    )
                  );
                })
              )
            )
          :
          activeFilter==='favorites' ?
            h('div', { className: 'space-y-4 animate-in' },
              h('div', null,
                h('h2', { className: 'text-[28px] font-extrabold tracking-tight' }, `즐겨찾기 ${favorites.size}개`),
                h('div', { className: 'text-[13px] mt-1', style: { color: 'var(--text-2)' } }, '내가 저장한 용어 모음')
              ),
              favorites.size===0 ? h('div', { className: 'py-20 text-center rounded-[16px] border border-dashed', style: { borderColor: 'var(--border)', color: 'var(--text-3)' } }, h('div', { className: 'text-[13px]' }, '즐겨찾기가 없습니다'), h('div', { className: 'text-[11px] mt-1' }, '용어 상세에서 ★를 눌러보세요')) :
              h('div', { className: 'grid md:grid-cols-2 gap-3' },
                Array.from(favorites).map(name=>{
                  const t = allTerms.find(x=>x.term===name);
                  if (!t) return null;
                  return h('div', { key: t.id, className: 'p-4 rounded-[16px] border flex justify-between gap-3', style: { background: 'var(--surface)', borderColor: 'var(--border)' } },
                    h('button', { onClick: ()=>onSelectTerm(t), className: 'text-left flex-1' },
                      h('div', { className: 'font-bold text-[14px]' }, t.term),
                      h('div', { className: 'text-[11px]', style: { color: 'var(--text-3)' } }, t.category),
                      h('div', { className: 'text-[12px] mt-1 line-clamp-2', style: { color: 'var(--text-2)' } }, t.meaning)
                    ),
                    h('button', { onClick: ()=>onToggleFav(t.term), className: 'h-8 w-8 rounded-full bg-black text-white dark:bg-white dark:text-black grid place-items-center shrink-0' }, '★')
                  );
                })
              )
            )
          :
            h(TermDetail, { term: selectedTerm, allTerms, favorites, onToggleFav, onSelectTerm, getColor: getCategoryColor })
        )
      )
    ),
    // Mobile bottom bar for quick search
    h('div', { className: 'lg:hidden fixed bottom-4 left-4 right-4 z-20' },
      h('button', { onClick: ()=>setIsCommandOpen(true), className: 'w-full h-12 rounded-full border shadow-lg flex items-center justify-center gap-2 font-medium text-[14px]', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, '🔍 검색 (⌘K)')
    )
  );
}

const root = createRoot(document.getElementById('root'));
root.render(h(App));
