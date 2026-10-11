// glossary/js/config.js - 소문자 파일명 규칙, Supabase 연동 + 이전 UI 유지
export const SUPABASE_URL = 'https://efklbyhqsmbieefbamen.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_5fLBN1VzY0Th2p3Leq4fuA_9UFP78fl';
export const CSV_PATH = './terms.csv';

export const CATEGORY_COLORS = {
  '데이터베이스·SQL': '#0ea5e9',
  '개발 기본': '#111827',
  '프론트엔드': '#3b82f6',
  '백엔드': '#ef4444',
  'AI·ML': '#8b5cf6',
  '클라우드·DevOps': '#f59e0b',
  '보안': '#dc2626',
  '네트워크': '#14b8a6',
  '데이터·분석': '#10b981',
  '모바일': '#06b6d4',
  '언어·프레임워크': '#ec4899',
  'CS 기본': '#6366f1',
  'Etc': '#9ca3af',
  // English fallback (Supabase에 영어 카테고리가 있을 경우)
  'AI/ML': '#8b5cf6',
  'Backend': '#ef4444',
  'Frontend': '#3b82f6',
  'Data': '#10b981',
  'DevOps': '#f59e0b',
  'Security': '#dc2626',
  'Mobile': '#06b6d4',
  'Cloud': '#6366f1',
  'Database': '#0ea5e9',
  'Network': '#14b8a6',
  'Language': '#ec4899'
};

export const CATEGORIES = [
  '데이터베이스·SQL','개발 기본','프론트엔드','백엔드','AI·ML','클라우드·DevOps',
  '보안','네트워크','데이터·분석','모바일','언어·프레임워크','CS 기본','Etc',
  'AI/ML','Backend','Frontend','Data','DevOps','Security','Mobile','Cloud','Database','Network','Language'
];

export const TOP30 = [
  'CRUD','REST','API','MVC','SQL','NoSQL','JWT','OAuth','ORM','CI/CD',
  'Docker','Kubernetes','Git','HTTP','HTTPS','TCP/IP','DNS','CDN',
  'AI','ML','LLM','RAG','Vector DB','Transformer','Prompt','Fine-tuning',
  'React','Node.js','TypeScript','GraphQL'
];

export const INITIAL_TERM = null;

export function getCategoryColor(cat) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS['개발 기본'] || '#111827';
}

export const LOCAL_STORAGE_KEYS = {
  favorites: 'it-ai-glossary:favorites:v1',
  theme: 'it-ai-glossary:theme'
};

export function getCategoryList() { return CATEGORIES; }
