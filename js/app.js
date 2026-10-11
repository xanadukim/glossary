// glossary/js/app.js - v2 fixed: filters left of search, left=list right=detail+related
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { loadTerms } from './loader.js';
import { getCategoryColor, TOP30, LOCAL_STORAGE_KEYS } from './config.js';
import { Header, TermList, DetailPanel, CommandPalette } from './components.js';

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

  useEffect(()=>{
    (async()=>{
      const { allTerms: loaded, categories: cats } = await loadTerms();
      setAllTerms(loaded);
      setCategories(cats);
      const hash = window.location.hash.replace('#','');
      const fromHash = hash ? loaded.find(t=>t.id===hash) : null;
      if (fromHash) setSelectedTerm(fromHash);
      else if (loaded.length>0) setSelectedTerm(loaded[0]);
    })();
  }, []);

  useEffect(()=>{
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.favorites);
      if (saved) setFavorites(new Set(JSON.parse(saved)));
    } catch {}
  }, []);
  useEffect(()=>{
    try { localStorage.setItem(LOCAL_STORAGE_KEYS.favorites, JSON.stringify([...favorites])); } catch {}
  }, [favorites]);

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

  useEffect(()=>{
    const onKey = (e)=>{
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='k') { e.preventDefault(); setIsCommandOpen(v=>!v); }
      if (e.key==='Escape') setIsCommandOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(()=>{ if (selectedTerm) history.replaceState(null, '', '#' + selectedTerm.id); }, [selectedTerm]);

  // Filtered terms for LEFT panel - single source
  const filteredTerms = useMemo(()=>{
    let list = allTerms;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t=> t.term.toLowerCase().includes(q) || t.meaning.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    } else if (activeFilter==='top30') {
      list = list.filter(t=> TOP30.includes(t.term) || TOP30.includes(t.id));
    } else if (activeFilter==='favorites') {
      list = list.filter(t=> favorites.has(t.term));
    } else if (selectedCategory) {
      list = list.filter(t=> t.category===selectedCategory);
    }
    return list;
  }, [allTerms, searchQuery, activeFilter, selectedCategory, favorites]);

  // When filter/category/search changes, auto-select first term in left list to show detail on right
  useEffect(()=>{
    if (filteredTerms.length>0) {
      const exists = selectedTerm && filteredTerms.some(t=>t.id===selectedTerm.id);
      if (!exists) {
        setSelectedTerm(filteredTerms[0]);
      }
    } else {
      // If no results (e.g., favorites empty), clear detail to show empty state
      setSelectedTerm(null);
    }
  }, [filteredTerms]);

  const onSelectTerm = (t)=>{
    setSelectedTerm(t);
    setIsMobileOpen(false);
    setIsCommandOpen(false);
    // Clear search after selecting to show detail (fix: 검색 후 클릭 시 변화 없음)
    // Keep filter/category so left list stays, but ensure detail shows
    if (searchQuery) {
      // Optionally keep search but show detail - we clear search to show full context
      // User wants left=list right=detail, so keep filtered but clear search input for clarity
      // setSearchQuery(''); // keep as is? Let's clear to avoid confusion
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setFilter = (filter)=>{
    // Unified filter setter - fixes TOP30 and favorites click bug
    if (filter===null) { setActiveFilter(null); setSelectedCategory(null); setSearchQuery(''); }
    else if (filter==='top30' || filter==='favorites') { setActiveFilter(filter); setSelectedCategory(null); setSearchQuery(''); }
    else { setSelectedCategory(filter); setActiveFilter(null); setSearchQuery(''); }
    setIsMobileOpen(false);
  };

  const onToggleFav = (termName)=>{
    setFavorites(prev=>{
      const next = new Set(prev);
      if (next.has(termName)) next.delete(termName);
      else next.add(termName);
      return next;
    });
  };

  return h('div', { className: 'min-h-screen flex flex-col', style: { background: 'var(--bg)' } },
    h(Header, {
      searchQuery,
      setSearchQuery,
      onOpenCommand: ()=>setIsCommandOpen(true),
      totalTerms: allTerms.length,
      activeFilter,
      setActiveFilter: (f)=>{ setFilter(f); },
      selectedCategory,
      setSelectedCategory: (c)=>{ setFilter(c); },
      isDark,
      toggleTheme,
      setMobileOpen: setIsMobileOpen
    }),
    h(CommandPalette, { isOpen: isCommandOpen, onClose: ()=>setIsCommandOpen(false), allTerms, categories, onSelectTerm, setFilter }),
    h('div', { className: 'flex-1 mx-auto max-w-[1680px] w-full px-0 md:px-4 py-0 md:py-4 flex flex-col lg:flex-row gap-0 md:gap-4 min-h-[calc(100vh-68px)]' },
      // Left: term list
      h('div', { className: `${isMobileOpen ? 'fixed inset-0 z-40 pt-[68px] md:pt-0 bg-[var(--bg)]' : 'hidden lg:flex'} lg:w-[360px] shrink-0 flex-col border-r md:border md:rounded-[20px] overflow-hidden`, style: { background: 'var(--surface)', borderColor: 'var(--border)', maxHeight: isMobileOpen ? '100vh' : 'calc(100vh - 84px)', position: isMobileOpen ? 'fixed' : 'sticky', top: isMobileOpen ? '0' : '84px' } },
        isMobileOpen && h('div', { className: 'p-3 border-b flex justify-between items-center lg:hidden', style: { borderColor: 'var(--border)' } },
          h('span', { className: 'text-[13px] font-bold' }, '용어 목록'),
          h('button', { onClick: ()=>setIsMobileOpen(false), className: 'h-8 px-3 rounded-full border text-[12px]', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, '✕ 닫기')
        ),
        h(TermList, {
          terms: filteredTerms,
          selectedTerm,
          onSelectTerm,
          selectedCategory,
          activeFilter,
          categories,
          setSelectedCategory: (c)=>setFilter(c),
          setActiveFilter: (f)=>setFilter(f),
          setSearchQuery,
          getColor: getCategoryColor,
          searchQuery
        })
      ),
      // Right: detail + related below
      h('div', { className: 'flex-1 min-w-0 border md:rounded-[20px] overflow-hidden', style: { background: 'var(--surface)', borderColor: 'var(--border)', minHeight: 'calc(100vh - 84px)' } },
        h(DetailPanel, { term: selectedTerm, allTerms, favorites, onToggleFav, onSelectTerm, getColor: getCategoryColor })
      )
    ),
    // Mobile FAB
    h('div', { className: 'lg:hidden fixed bottom-4 left-4 right-4 z-20 flex gap-2' },
      h('button', { onClick: ()=>setIsMobileOpen(true), className: 'flex-1 h-12 rounded-full border shadow-lg flex items-center justify-center gap-2 font-medium text-[13px]', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, `📚 목록 ${filteredTerms.length}개`),
      h('button', { onClick: ()=>setIsCommandOpen(true), className: 'h-12 w-12 rounded-full border shadow-lg grid place-items-center', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, '🔍')
    )
  );
}

const root = createRoot(document.getElementById('root'));
root.render(h(App));
