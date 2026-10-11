// glossary/js/app.js - v3 FIX: single setFilter, sorted, no empty right space, same-size boxes
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
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(()=>{
    (async()=>{
      const { allTerms: loaded, categories: cats } = await loadTerms();
      const sortedCats = [...cats].sort((a,b)=> b.count - a.count || a.name.localeCompare(b.name));
      setAllTerms(loaded);
      setCategories(sortedCats);
      const hash = window.location.hash.replace('#','');
      const fromHash = hash ? loaded.find(t=>t.id===hash) : null;
      setSelectedTerm(fromHash || loaded[0] || null);
    })();
  }, []);

  useEffect(()=>{
    try { const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.favorites); if (saved) setFavorites(new Set(JSON.parse(saved))); } catch {}
  }, []);
  useEffect(()=>{ try { localStorage.setItem(LOCAL_STORAGE_KEYS.favorites, JSON.stringify([...favorites])); } catch {} }, [favorites]);

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
    return [...list].sort((a,b)=> a.term.localeCompare(b.term));
  }, [allTerms, searchQuery, activeFilter, selectedCategory, favorites]);

  useEffect(()=>{
    if (filteredTerms.length>0) {
      const exists = selectedTerm && filteredTerms.some(t=>t.id===selectedTerm.id);
      if (!exists) setSelectedTerm(filteredTerms[0]);
    } else {
      setSelectedTerm(null);
    }
  }, [filteredTerms]);

  const onSelectTerm = (t)=>{
    setSelectedTerm(t);
    setIsMobileOpen(false);
    setIsCommandOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setFilter = (filter)=>{
    if (filter===null) { setActiveFilter(null); setSelectedCategory(null); setSearchQuery(''); }
    else if (filter==='top30' || filter==='favorites') { setActiveFilter(filter); setSelectedCategory(null); setSearchQuery(''); }
    else { setSelectedCategory(filter); setActiveFilter(null); setSearchQuery(''); }
    setIsMobileOpen(false);
  };

  const onToggleFav = (termName)=>{
    setFavorites(prev=>{ const next = new Set(prev); if (next.has(termName)) next.delete(termName); else next.add(termName); return next; });
  };

  return h('div', { className: 'min-h-screen flex flex-col', style: { background: 'var(--bg)' } },
    h(Header, { searchQuery, setSearchQuery, onOpenCommand: ()=>setIsCommandOpen(true), totalTerms: allTerms.length, activeFilter, selectedCategory, setFilter, isDark, toggleTheme, setMobileOpen: setIsMobileOpen }),
    h(CommandPalette, { isOpen: isCommandOpen, onClose: ()=>setIsCommandOpen(false), allTerms, categories, onSelectTerm, setFilter }),
    h('div', { className: 'flex-1 mx-auto max-w-[1680px] w-full px-3 md:px-4 py-3 md:py-4 flex flex-col lg:flex-row gap-3 min-h-[calc(100vh-64px)]' },
      h('div', { className: `${isMobileOpen ? 'fixed inset-0 z-40 pt-[64px] bg-[var(--bg)]' : 'hidden lg:flex'} lg:w-[340px] shrink-0 flex-col rounded-[16px] border overflow-hidden shadow-sm`, style: { background: 'var(--surface)', borderColor: 'var(--border)', maxHeight: isMobileOpen ? '100vh' : 'calc(100vh - 80px)', position: isMobileOpen ? 'fixed' : 'sticky', top: isMobileOpen ? '0' : '72px' } },
        isMobileOpen && h('div', { className: 'p-3 border-b flex justify-between items-center', style: { borderColor: 'var(--border)' } },
          h('span', { className: 'text-[12px] font-bold' }, `목록 ${filteredTerms.length}개`),
          h('button', { onClick: ()=>setIsMobileOpen(false), className: 'h-7 px-2.5 rounded-full border text-[11px]', style: { background: 'var(--surface-2)', borderColor: 'var(--border)' } }, '닫기')
        ),
        h(TermList, { terms: filteredTerms, selectedTerm, onSelectTerm, selectedCategory, activeFilter, categories, setFilter, getColor: getCategoryColor, searchQuery })
      ),
      h('div', { className: 'flex-1 min-w-0 rounded-[16px] border shadow-sm overflow-hidden', style: { background: 'var(--surface)', borderColor: 'var(--border)', minHeight: 'calc(100vh - 80px)' } },
        h(DetailPanel, { term: selectedTerm, allTerms, favorites, onToggleFav, onSelectTerm, getColor: getCategoryColor })
      )
    ),
    h('div', { className: 'lg:hidden fixed bottom-3 left-3 right-3 z-20 flex gap-2' },
      h('button', { onClick: ()=>setIsMobileOpen(true), className: 'flex-1 h-11 rounded-full border shadow-lg flex items-center justify-center gap-2 font-medium text-[12px]', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, `📚 ${filteredTerms.length}개`),
      h('button', { onClick: ()=>setIsCommandOpen(true), className: 'h-11 w-11 rounded-full border shadow-lg grid place-items-center text-[13px]', style: { background: 'var(--surface)', borderColor: 'var(--border)' } }, '🔍')
    )
  );
}

const root = createRoot(document.getElementById('root'));
root.render(h(App));
