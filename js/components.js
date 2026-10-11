
import React from 'react';
import { CATEGORY_COLORS } from './config.js';
import { getExamples, getMapping } from './helpers.js';
const e = React.createElement;
export function Header({ searchQuery, setSearchQuery, debouncedQuery, searchResults, onSelectTerm, totalTerms, totalCategories, isDark, toggleTheme, setMobileOpen, searchRef }) {
  return e('header', { className: 'sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl' },
    e('div', { className: 'mx-auto max-w-[1680px] px-4 md:px-6 lg:px-8 h-[64px] flex items-center gap-4' },
      e('button', { onClick: () => setMobileOpen(v=>!v), className: 'lg:hidden h-9 w-9 grid place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)]' }, e('div', { className: 'space-y-1' }, e('div', { className: 'h-[2px] w-4 bg-[var(--text)]' }), e('div', { className: 'h-[2px] w-4 bg-[var(--text)]' }), e('div', { className: 'h-[2px] w-4 bg-[var(--text)]' }))),
      e('div', { className: 'flex items-center gap-3 min-w-0' },
        e('div', { className: 'h-9 w-9 rounded-xl bg-black text-white dark:bg-white dark:text-black grid place-items-center font-bold' }, 'IT'),
        e('div', { className: 'leading-none' },
          e('div', { className: 'font-extrabold text-[17px] flex items-center gap-2' }, 'IT·AI 용어 사전', e('span', { className: 'hidden md:inline-flex text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)]' }, 'GLOSSARY DASH')),
          e('div', { className: 'text-[11px] text-[var(--text-2)] mt-0.5 hidden md:block' }, '예시 포맷 그대로 · 검색 & 카테고리 탐색')
        )
      ),
      e('div', { className: 'flex-1 max-w-[560px] mx-2 md:mx-6 relative' },
        e('div', { className: 'relative' },
          e('span', { className: 'absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]' }, '🔍'),
          e('input', { ref: searchRef, value: searchQuery, onChange: ev=>setSearchQuery(ev.target.value), placeholder: '용어, 풀네임, 뜻, 예시로 검색 — 예: CRUD, RAG, JOIN', className: 'w-full h-10 pl-10 pr-10 rounded-full border border-[var(--border)] bg-[var(--surface-2)] focus:bg-[var(--surface)] outline-none text-[14px]' }),
          searchQuery && e('button', { onClick: ()=>setSearchQuery(''), className: 'absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[var(--surface-3)]' }, '✕')
        ),
        debouncedQuery && e('div', { className: 'absolute top-[48px] left-0 right-0 z-20 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] max-h-[60vh] overflow-y-auto' },
          e('div', { className: 'px-4 py-2 text-[11px] font-semibold text-[var(--text-3)] border-b' }, `검색 결과 ${searchResults.length}개`),
          searchResults.map(h=> e('button', { key: h.term+h.category, onClick: ()=>onSelectTerm(h), className: 'w-full text-left px-4 py-3 hover:bg-[var(--surface-2)] flex justify-between border-b last:border-0' }, e('div', null, e('div', { className: 'font-bold' }, h.term), e('div', { className: 'text-[12px] text-[var(--text-2)]' }, `${h.meaning} · ${h.example}`)), e('span', { className: 'text-[11px] px-2 py-1 rounded-full border', style: { background: (CATEGORY_COLORS[h.category]||CATEGORY_COLORS['개발 기본']).light, borderColor: (CATEGORY_COLORS[h.category]||CATEGORY_COLORS['개발 기본']).border, color: (CATEGORY_COLORS[h.category]||CATEGORY_COLORS['개발 기본']).text } }, h.category)))
        )
      ),
      e('div', { className: 'ml-auto flex items-center gap-2' },
        e('span', { className: 'hidden md:inline px-2.5 py-1 rounded-full border bg-[var(--surface-2)] text-[11px]' }, `총 ${totalTerms}개 용어`),
        e('span', { className: 'hidden md:inline px-2.5 py-1 rounded-full border bg-[var(--surface-2)] text-[11px]' }, `${totalCategories}개 분류`),
        e('button', { onClick: toggleTheme, className: 'h-9 w-9 rounded-full border bg-[var(--surface-2)]' }, isDark?'☀︎':'☾')
      )
    )
  );
}
export function Tabs({ activeTab, setActiveTab, favoritesCount }) {
  const tabs=[{id:'all',label:'전체'},{id:'category',label:'카테고리별 보기'},{id:'top30',label:'초보자 30선'},{id:'favorites',label:`즐겨찾기 ${favoritesCount?`· ${favoritesCount}`:''}`}];
  return e('div', { className: 'mx-auto max-w-[1680px] px-4 md:px-6 lg:px-8 flex items-center gap-1 h-[44px] border-t overflow-x-auto' },
    tabs.map(h=> e('button', { key:h.id, 'data-tab':h.id, onClick:()=>setActiveTab(h.id), className:`h-7 px-3 rounded-full text-[13px] border ${activeTab===h.id?'bg-black text-white border-black dark:bg-white dark:text-black':'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-2)]'}` }, h.label)),
    e('div', { className: 'ml-auto hidden md:flex items-center gap-2 text-[11px] text-[var(--text-3)]' }, e('span', { className: 'h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse' }), ' 실시간 검색 · 예시 포맷 유지')
  );
}
export function LeftSidebar({ categories, selectedCategories, toggleCategory, selectedTerm, onSelectTerm, searchActive, searchResults, isMobileOpen, setMobileOpen, getColor }) {
  return e(React.Fragment, null,
    e('aside', { className: `fixed lg:sticky top-[108px] z-20 h-[calc(100dvh-108px)] w-[84vw] max-w-[340px] lg:w-[320px] shrink-0 bg-[var(--surface)] lg:bg-transparent border-r lg:border-0 border-[var(--border)] overflow-y-auto transition-transform ${isMobileOpen?'translate-x-0':'-translate-x-full lg:translate-x-0'}` },
      e('div', { className: 'p-4 lg:pr-4 lg:py-6 space-y-4' },
        searchActive ? e('div', { className: 'rounded-2xl border bg-[var(--surface)] p-2' }, searchResults.map(h=> e('button', { key:h.term, onClick:()=>onSelectTerm(h), className:`w-full text-left px-3 py-2 rounded-xl ${selectedTerm?.term===h.term?'bg-black text-white':'hover:bg-[var(--surface-2)]'}` }, h.term))) :
        categories.map(h=>{ const isOpen=selectedCategories.has(h.name); const color=getColor(h.name); return e('div', { key:h.name, className: 'rounded-[16px] border bg-[var(--surface)] overflow-hidden' },
          e('button', { onClick:()=>toggleCategory(h.name), className: 'w-full flex items-center gap-3 px-3.5 py-3 text-left' }, e('span', { className: 'h-2.5 w-2.5 rounded-full', style:{background:color.dot} }), e('span', { className: 'font-semibold text-[13.5px] flex-1' }, h.name), e('span', { className: 'text-[11px] px-1.5 py-0.5 rounded-full bg-[var(--surface-2)] border' }, h.terms.length), e('span', { className: `text-[var(--text-3)] ${isOpen?'rotate-180':''}` }, '⌄')),
          isOpen && e('div', { className: 'px-2 pb-2 space-y-0.5' }, h.terms.map(sn=>{ const isActive=selectedTerm?.term===sn.term; return e('button', { key:sn.term, onClick:()=>onSelectTerm({...sn, category:h.name}), className:`w-full text-left px-3 py-2 rounded-xl flex gap-2 ${isActive?'bg-black text-white dark:bg-white dark:text-black':'hover:bg-[var(--surface-2)] text-[var(--text-2)]'}` }, e('span', { className: 'text-[13px] truncate' }, sn.term), e('span', { className: 'ml-auto text-[11px] opacity-60 truncate' }, sn.meaning.slice(0,12))); })))
        }),
        e('div', { className: 'rounded-[16px] border-dashed border p-3.5 bg-[var(--surface-2)]/60' }, e('div', { className: 'text-[11px] font-bold' }, 'TIP'), e('div', { className: 'text-[12px] text-[var(--text-2)] mt-1' }, 'CRUD처럼 모든 용어는 정의 → 핵심 정리 → 어떻게 쓰이나요? → 간단히 말해 구조로 설명돼요.'))
      )
    ),
    isMobileOpen && e('div', { className: 'fixed inset-0 bg-black/30 z-10 lg:hidden', onClick:()=>setMobileOpen(false) })
  );
}
export function DetailView({ term, favorites, toggleFavorite, getColor, onSelectTerm, searchRef, copyState, setCopyState }) {
  if(!term) return null;
  const color=getColor(term.category); const mapping=getMapping(term); const examples=getExamples(term);
  return e('div', { className: 'space-y-0' },
    e('div', { className: 'flex justify-between gap-4' },
      e('div', { className: 'min-w-0' },
        e('div', { className: 'flex flex-wrap gap-2' }, e('span', { className: 'text-[11px] px-2.5 py-1 rounded-full bg-[var(--surface-2)] border' }, term.term.toUpperCase()), term.fullname!==term.term && e('span', { className: 'text-[11px] px-2.5 py-1 rounded-full border', style:{background:color.light, borderColor:color.border, color:color.text} }, term.fullname), e('span', { className: 'text-[11px] px-2 py-1 rounded-full bg-[var(--surface-2)] border' }, term.category), term.isDefaultFav && e('span', { className: 'text-[11px] px-2 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black' }, '기본 즐겨찾기')),
        e('div', { className: 'mt-3 flex items-center gap-2 text-[13px] text-[var(--text-2)]' }, e('span', { className: 'mono' }, term.fullname), e('span', { className: 'h-1 w-1 rounded-full bg-[var(--border-2)]' }), e('span', { className: 'flex items-center gap-1' }, e('span', { className: 'h-2 w-2 rounded-full', style:{background:color.dot} }), term.meaning))
      ),
      e('div', { className: 'flex gap-1.5' },
        e('button', { onClick:()=>toggleFavorite(term.term), className:`h-9 w-9 rounded-full border ${favorites.has(term.term)?'bg-black text-white border-black dark:bg-white dark:text-black':'bg-[var(--surface-2)] border-[var(--border)]'}` }, favorites.has(term.term)?'★':'☆'),
        e('button', { onClick:()=>{ navigator.clipboard.writeText(`${term.term} (${term.fullname}) - ${term.meaning}`); setCopyState('term'); setTimeout(()=>setCopyState(null),1200); }, className: 'h-9 px-3 rounded-full border bg-[var(--surface-2)] text-[12px]' }, copyState==='term'?'복사됨!':'복사')
      )
    ),
    term.isCRUD ? e('p', { className: 'mt-8 text-[18px] md:text-[20px] leading-[1.65] font-medium' }, e('span', { className: 'font-black' }, term.term), '는 데이터베이스(DB)에서 데이터를 다루는 4가지 기본 연산을 뜻하는 약어로, ', e('span', { className: 'font-bold' }, 'Create(생성) · Read(읽기/조회) · Update(수정) · Delete(삭제)'), '를 의미합니다.') : e('p', { className: 'mt-8 text-[17px] md:text-[19px] leading-[1.7]' }, e('span', { className: 'font-black' }, term.term), '는 ', e('span', { className: 'font-semibold underline' }, term.meaning), `를 뜻하는 용어입니다. ${term.example}처럼 현업에서 자주 쓰이며, ${term.category} 맥락에서 핵심 개념으로 알아두면 좋아요.`),
    term.longDesc && e('div', { className: 'mt-6 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5' }, e('div', { className: 'text-[11px] font-bold tracking-widest text-[var(--text-3)] mb-2' }, '상세 설명'), e('div', { className: 'text-[14px] leading-[1.7] text-[var(--text)] whitespace-pre-wrap' }, term.longDesc)),
    e('div', { className: 'mt-8 rounded-[18px] border bg-[var(--surface-2)] p-5 md:p-6' },
      e('div', { className: 'flex items-center gap-2 mb-4' }, e('span', { className: 'h-6 w-6 rounded-full bg-black text-white dark:bg-white dark:text-black grid place-items-center text-[12px] font-bold' }, '✓'), e('span', { className: 'font-bold text-[14px]' }, '핵심 정리'), e('button', { onClick:()=>{ navigator.clipboard.writeText(`${term.term} | ${term.fullname} | ${term.meaning} | ${term.example}`); setCopyState('core'); setTimeout(()=>setCopyState(null),1200); }, className: 'ml-auto text-[11px] px-2.5 py-1 rounded-full bg-[var(--surface)] border' }, copyState==='core'?'복사됨':'복사')),
      e('div', { className: 'grid grid-cols-2 gap-4 text-[13px]' },
        e('div', { className: 'space-y-3' }, e('div', null, e('div', { className: 'text-[11px] font-bold text-[var(--text-3)]' }, '뜻'), e('div', { className: 'mt-1 font-medium' }, term.meaning)), e('div', null, e('div', { className: 'text-[11px] font-bold text-[var(--text-3)]' }, '풀네임'), e('div', { className: 'mt-1 mono' }, term.fullname))),
        e('div', { className: 'space-y-3' }, e('div', null, e('div', { className: 'text-[11px] font-bold text-[var(--text-3)]' }, '분류'), e('div', { className: 'mt-1 flex items-center gap-1.5' }, e('span', { className: 'h-2 w-2 rounded-full', style:{background:color.dot} }), term.category)), e('div', null, e('div', { className: 'text-[11px] font-bold text-[var(--text-3)]' }, '예시'), e('div', { className: 'mt-1 font-medium' }, term.example)))
      )
    ),
    mapping && e('div', { className: 'mt-8' },
      e('div', { className: 'flex items-center gap-2 mb-3' }, e('h2', { className: 'font-bold text-[15px]' }, mapping.title), e('span', { className: 'text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] border' }, '자동 생성 매핑')),
      e('div', { className: 'overflow-x-auto rounded-[16px] border' }, e('table', { className: 'w-full text-[13px]' }, e('thead', { className: 'bg-[var(--surface-2)] text-[11px] text-[var(--text-3)]' }, e('tr', null, e('th', { className: 'text-left px-4 py-2.5' }, '연산'), e('th', { className: 'text-left px-4 py-2.5' }, '의미'), e('th', { className: 'text-left px-4 py-2.5' }, '설명'), e('th', { className: 'text-left px-4 py-2.5' }, 'SQL'))), e('tbody', null, mapping.rows.map((h,i)=> e('tr', { key:i, className: 'border-t hover:bg-[var(--surface-2)]/60' }, e('td', { className: 'px-4 py-3 font-bold' }, h.op, ' ', e('span', { className: 'font-normal text-[var(--text-2)]' }, `(${h.ko})`)), e('td', { className: 'px-4 py-3 text-[var(--text-2)]' }, h.ko), e('td', { className: 'px-4 py-3' }, h.desc), e('td', { className: 'px-4 py-3' }, e('code', { className: 'mono px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black text-[11px] font-bold' }, h.sql))))))),
      term.isCRUD && e('div', { className: 'mt-3 mono text-[11px] p-3 rounded-xl bg-[var(--surface-2)] border text-[var(--text-2)]' }, e('div', { className: 'font-bold text-[var(--text)] mb-1' }, 'SQL 예시'), e('div', null, "INSERT INTO users (name) VALUES ('kim'); — Create"), e('div', null, 'SELECT * FROM users WHERE id=1; — Read'), e('div', null, "UPDATE users SET name='lee' WHERE id=1; — Update"), e('div', null, 'DELETE FROM users WHERE id=1; — Delete'))
    ),
    e('div', { className: 'mt-10' }, e('h2', { className: 'font-bold text-[15px] flex items-center gap-2' }, '어떻게 쓰이나요? ', e('span', { className: 'h-1.5 w-1.5 rounded-full bg-[var(--border-2)]' }), e('span', { className: 'text-[11px] text-[var(--text-3)]' }, term.example)), e('div', { className: 'mt-3 rounded-[16px] bg-[var(--surface-2)] border p-5 text-[14px] leading-[1.75] text-[var(--text-2)]' }, e('div', { className: 'text-[var(--text)] font-medium' }, `“${term.example}”라는 상황에서 ${term.term}는 이렇게 쓰여요.`), e('div', { className: 'mt-2' }, '예를 들어 ', e('b', { className: 'text-[var(--text)]' }, term.term), `는 ${term.meaning} 맥락에서 등장해요. ${term.fullname}의 약자이며, 실무에서는 “${term.example}”를 구현할 때 빠지지 않는 개념입니다.`), e('ul', { className: 'mt-4 space-y-2' }, examples.map((h,i)=> e('li', { key:i, className: 'flex gap-2' }, e('span', { className: 'text-[var(--text-3)]' }, '·'), e('span', { className: 'text-[var(--text)]' }, h)))))),
    e('div', { className: 'mt-8 rounded-[16px] border bg-[#fef9c3]/70 dark:bg-[#fef9c3]/10 p-5 flex gap-3' }, e('div', { className: 'h-7 w-7 rounded-full bg-black text-white dark:bg-white dark:text-black grid place-items-center font-bold text-[13px]' }, '!'), e('div', null, e('div', { className: 'text-[11px] font-bold tracking-widest' }, '간단히 말해'), e('div', { className: 'mt-1 text-[14.5px] font-medium' }, term.isCRUD ? '“데이터를 만들고, 읽고, 고치고, 지운다”는 데이터 관리의 핵심 사이클을 CRUD라고 부릅니다.' : `“${term.example}”가 필요할 때 ${term.term}(${term.meaning})를 떠올리면 돼요.`))),
    e('div', { className: 'mt-8 flex gap-2' }, e('button', { onClick:()=>{ const txt=term.isCRUD?'CRUD는 데이터베이스(DB)에서 데이터를 다루는 4가지 기본 연산을 뜻하는 약어로, Create(생성) · Read(읽기/조회) · Update(수정) · Delete(삭제)를 의미합니다.':`${term.term}는 ${term.meaning}를 뜻하는 용어입니다. 예: ${term.example}`; navigator.clipboard.writeText(`${term.term} - ${term.meaning}\n${txt}${term.longDesc?'\n\n'+term.longDesc:''}`); setCopyState('all'); setTimeout(()=>setCopyState(null),1200); }, className: 'h-9 px-4 rounded-full bg-black text-white dark:bg-white dark:text-black text-[13px] font-semibold' }, copyState==='all'?'✓ 복사 완료':'예시 포맷으로 복사'), e('button', { onClick:()=>searchRef?.current?.focus(), className: 'h-9 px-4 rounded-full border bg-[var(--surface)] text-[13px]' }, '다른 용어 검색'))
  );
}
export function RightSidebar({ related, top30, allTerms, selected, onSelect, favorites, onToggleFav }) {
  return e('div', { className: 'space-y-5' },
    e('div', { className: 'rounded-[20px] border bg-[var(--surface)] p-4' },
      e('div', { className: 'flex justify-between' }, e('h3', { className: 'font-bold text-[13px]' }, '연관 용어'), e('span', { className: 'text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] border text-[var(--text-3)]' }, selected?.category)),
      e('div', { className: 'mt-3 space-y-2' }, related.map(a=> e('button', { key:a.term, onClick:()=>onSelect(a), className: 'w-full text-left rounded-xl border bg-[var(--surface-2)] p-3 flex justify-between' }, e('div', null, e('div', { className: 'font-semibold text-[13px]' }, a.term), e('div', { className: 'text-[11px] text-[var(--text-2)]' }, a.meaning)), e('div', { className: 'h-6 w-6 rounded-full bg-[var(--surface)] border grid place-items-center text-[10px]' }, '→'))), related.length===0 && e('div', { className: 'text-[12px] text-[var(--text-3)] p-2' }, '같은 카테고리에 다른 용어가 없어요.'))
    ),
    e('div', { className: 'rounded-[20px] border bg-[var(--surface)] p-4' },
      e('h3', { className: 'font-bold text-[13px]' }, '초보자 30선 빠른 접근'),
      e('div', { className: 'mt-3 flex flex-wrap gap-1.5' }, top30.slice(0,16).map(a=>{ const f=allTerms.find(g=> g.term===a.term || a.term.includes(g.term) || g.term.includes(a.term.split('/')[0])); return e('button', { key:a.term, onClick:()=>f&&onSelect(f), className: 'text-[11px] px-2.5 py-1.5 rounded-full border bg-[var(--surface-2)] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black' }, a.term); })),
      e('button', { onClick:()=>{ const btn=document.querySelector('[data-tab="top30"]'); if(btn) btn.click(); }, className: 'mt-3 w-full h-8 rounded-full bg-[var(--surface-2)] border text-[12px]' }, '전체 30선 보기')
    ),
    e('div', { className: 'rounded-[20px] border bg-[var(--surface)] p-4' },
      e('h3', { className: 'font-bold text-[13px] flex gap-2' }, '즐겨찾기 ', e('span', { className: 'text-[11px] font-normal text-[var(--text-3)]' }, '(자동저장)')),
      favorites.size===0 ? e('div', { className: 'mt-3 text-[12px] text-[var(--text-3)]' }, '☆를 눌러 자주 보는 용어를 모아두세요. 브라우저에 자동 저장돼요.') : e('div', { className: 'mt-3 flex flex-wrap gap-1.5' }, Array.from(favorites).map(a=> e('span', { key:a, className: 'inline-flex gap-1 text-[11px] px-2.5 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black' }, a, e('button', { onClick:()=>onToggleFav(a), className: 'ml-1 opacity-70' }, '✕'))))
    )
  );
}
export function CategoryGridView({ categories, onSelectCategory, getColor }) {
  return e('div', { className: 'space-y-6' }, e('h2', { className: 'text-[22px] font-extrabold' }, '카테고리별 보기'), e('div', { className: 'grid md:grid-cols-2 xl:grid-cols-3 gap-4' }, categories.map(h=>{ const col=getColor(h.name); return e('button', { key:h.name, onClick:()=>onSelectCategory(h.name), className: 'text-left rounded-[20px] border bg-[var(--surface)] p-5 hover:shadow-[var(--shadow)]' }, e('div', { className: 'flex items-center gap-3' }, e('span', { className: 'h-9 w-9 rounded-full grid place-items-center text-white font-bold', style:{background:col.dot} }, h.name.slice(0,1)), e('div', null, e('div', { className: 'font-bold' }, h.name), e('div', { className: 'text-[12px] text-[var(--text-2)]' }, `${h.terms.length}개 용어`))), e('div', { className: 'mt-4 flex flex-wrap gap-1.5' }, h.terms.slice(0,8).map(w=> e('span', { key:w.term, className: 'text-[11px] px-2 py-1 rounded-full bg-[var(--surface-2)] border' }, w.term)))); })));
}
export function Top30View({ top30, allTerms, onSelectTerm }) {
  return e('div', { className: 'space-y-6' }, e('h2', { className: 'text-[22px] font-extrabold' }, '초보자 30선'), e('div', { className: 'grid md:grid-cols-2 gap-3' }, top30.map(item=>{ const found=allTerms.find(t=> t.term===item.term || item.term.includes(t.term)); return e('button', { key:item.term, onClick:()=>found&&onSelectTerm(found), className: 'text-left rounded-[16px] border bg-[var(--surface)] p-4 flex justify-between' }, e('div', null, e('div', { className: 'font-bold' }, item.term), e('div', { className: 'text-[12px] text-[var(--text-2)] mt-1' }, item.desc)), e('span', null, '→')); })));
}
export function FavoritesView({ favorites, allTerms, onSelectTerm, onToggleFav }) {
  const favTerms=Array.from(favorites).map(n=>allTerms.find(t=>t.term===n)).filter(Boolean);
  return e('div', { className: 'space-y-6' }, e('h2', { className: 'text-[22px] font-extrabold' }, `즐겨찾기 ${favorites.size}개`), favorites.size===0? e('div', { className: 'rounded-[16px] border-dashed border p-8 text-center text-[var(--text-2)]' }, '즐겨찾기한 용어가 없어요.') : e('div', { className: 'grid md:grid-cols-2 gap-3' }, favTerms.map(t=> e('div', { key:t.term, className: 'rounded-[16px] border bg-[var(--surface)] p-4 flex justify-between' }, e('button', { onClick:()=>onSelectTerm(t), className: 'text-left' }, e('div', { className: 'font-bold' }, t.term), e('div', { className: 'text-[12px] text-[var(--text-2)]' }, t.meaning)), e('button', { onClick:()=>onToggleFav(t.term), className: 'h-8 w-8 rounded-full bg-[var(--surface-2)]' }, '✕')))));
}
