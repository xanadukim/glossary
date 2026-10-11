
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { CATEGORY_COLORS, TOP30, INITIAL_TERM } from './config.js';
import { loadTerms } from './loader.js';
import { Header, Tabs, LeftSidebar, DetailView, RightSidebar, CategoryGridView, Top30View, FavoritesView } from './components.js';
function App() {
  const [isDark, setIsDark] = useState(false);
  const [selectedTerm, setSelectedTermState] = useState(INITIAL_TERM);
  const [selectedCategories, setSelectedCategories] = useState(new Set(['데이터베이스·SQL']));
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [copyState, setCopyState] = useState(null);
  const [toast, setToast] = useState('');
  const [categories, setCategories] = useState([]);
  const [allTerms, setAllTerms] = useState([]);
  const searchRef = useRef(null);
  useEffect(()=>{ setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches); },[]);
  useEffect(()=>{ if(isDark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); },[isDark]);
  useEffect(()=>{ const h=setTimeout(()=>setDebouncedQuery(searchQuery.trim()),200); return()=>clearTimeout(h); },[searchQuery]);
  useEffect(()=>{ if(toast){ const t=setTimeout(()=>setToast(''),1500); return()=>clearTimeout(t);} },[toast]);
  useEffect(()=>{
    const saved = (()=>{ try { return JSON.parse(localStorage.getItem('it-ai-glossary:favorites:v1')||'[]'); } catch { return null; } })();
    loadTerms().then(({categories, allTerms})=>{
      setCategories(categories);
      setAllTerms(allTerms);
      const crud=allTerms.find(t=>t.term==='CRUD')||allTerms[0];
      if(crud) setSelectedTermState(crud);
      if(!saved || saved.length===0){
        const defaults = allTerms.filter(t=>t.isDefaultFav).map(t=>t.term);
        if(defaults.length>0) setFavorites(new Set(defaults));
      } else {
        setFavorites(new Set(saved));
      }
    }).catch(()=>setToast('terms.csv 로드 실패'));
  },[]);
  useEffect(()=>{ try { localStorage.setItem('it-ai-glossary:favorites:v1', JSON.stringify(Array.from(favorites))); } catch {} },[favorites]);
  const searchResults = useMemo(()=>{ if(!debouncedQuery) return []; const q=debouncedQuery.toLowerCase(); return allTerms.filter(t=> t.term.toLowerCase().includes(q) || t.fullname.toLowerCase().includes(q) || t.meaning.toLowerCase().includes(q) || t.example.toLowerCase().includes(q) || (t.longDesc||'').toLowerCase().includes(q)).slice(0,80); },[debouncedQuery, allTerms]);
  const related = useMemo(()=>{ const cat=categories.find(c=>c.name===selectedTerm?.category); if(!cat) return []; return cat.terms.filter(t=>t.term!==selectedTerm?.term).slice(0,4); },[selectedTerm, categories]);
  const getColor = (catName)=> CATEGORY_COLORS[catName] || CATEGORY_COLORS['개발 기본'];
  const toggleTheme = ()=> setIsDark(v=>!v);
  const onSelectTerm = (term)=>{ setSelectedTermState(term); setMobileOpen(false); setActiveTab('all'); window.scrollTo({top:0, behavior:'smooth'}); };
  const toggleCategory = (cat)=>{ setSelectedCategories(prev=>{ const next=new Set(prev); if(next.has(cat)) next.delete(cat); else next.add(cat); return next; }); };
  const onSelectCategory = (catName)=>{ setSelectedCategories(new Set([catName])); setActiveTab('all'); };
  const toggleFavorite = (termStr)=>{ setFavorites(prev=>{ const next=new Set(prev); if(next.has(termStr)) next.delete(termStr); else next.add(termStr); return next; }); };
  return React.createElement('div', { className: 'min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased' },
    React.createElement(Header, { searchQuery, setSearchQuery, debouncedQuery, searchResults, onSelectTerm, totalTerms: allTerms.length||447, totalCategories: categories.length||12, isDark, toggleTheme, setMobileOpen, searchRef }),
    React.createElement(Tabs, { activeTab, setActiveTab, favoritesCount: favorites.size }),
    toast && React.createElement('div', { className: 'fixed top-[120px] left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[12px]' }, toast),
    React.createElement('div', { className: 'mx-auto max-w-[1680px] px-0 md:px-6 lg:px-8 flex items-start' },
      React.createElement(LeftSidebar, { categories, selectedCategories, toggleCategory, selectedTerm, onSelectTerm, searchActive: !!debouncedQuery, searchResults, isMobileOpen, setMobileOpen, getColor }),
      React.createElement('main', { className: 'flex-1 min-w-0 px-4 md:px-6 lg:px-8 py-5 md:py-7' },
        activeTab==='category' ? React.createElement(CategoryGridView, { categories, onSelectCategory, getColor }) :
        activeTab==='top30' ? React.createElement(Top30View, { top30: TOP30, allTerms, onSelectTerm }) :
        activeTab==='favorites' ? React.createElement(FavoritesView, { favorites, allTerms, onSelectTerm, onToggleFav: toggleFavorite }) :
        React.createElement(React.Fragment, null,
          React.createElement(DetailView, { term: selectedTerm, favorites, toggleFavorite, getColor, onSelectTerm, searchRef, copyState, setCopyState }),
          React.createElement('div', { className: 'mt-6 xl:hidden' }, React.createElement(RightSidebar, { related, top30: TOP30, allTerms, selected: selectedTerm, onSelect: onSelectTerm, favorites, onToggleFav: toggleFavorite }))
        )
      ),
      activeTab==='all' && React.createElement('aside', { className: 'hidden xl:block w-[320px] shrink-0 sticky top-[108px] h-[calc(100dvh-108px)] overflow-y-auto py-7 pl-0 pr-2' }, React.createElement(RightSidebar, { related, top30: TOP30, allTerms, selected: selectedTerm, onSelect: onSelectTerm, favorites, onToggleFav: toggleFavorite }))
    ),
    React.createElement('footer', { className: 'mx-auto max-w-[1680px] px-4 md:px-8 py-10 text-[11px] text-[var(--text-3)] border-t mt-8 flex justify-between' }, React.createElement('span', null, '© IT·AI 용어 사전 · 예시 포맷 기반 대시보드 · CRUD 기본 선택 · ', React.createElement('a', { href: './admin.html', className: 'underline hover:text-[var(--text)]' }, '관리자')), React.createElement('span', { className: 'mono' }, 'BUILT WITH REACT + TAILWIND'))
  );
}
const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App));
