// glossary/js/config.js - 소문자 파일명 규칙 준수
export const SUPABASE_URL = 'https://efklbyhqsmbieefbamen.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_5fLBN1VzY0Th2p3Leq4fuA_9UFP78fl';

export const CATEGORIES = [
  'AI/ML', 'Backend', 'Frontend', 'Data', 'DevOps', 'Security',
  'Mobile', 'Cloud', 'Database', 'Network', 'Language', 'Etc'
];

export const CATEGORY_COLORS = {
  'AI/ML': '#8b5cf6',
  'Backend': '#ef4444',
  'Frontend': '#3b82f6',
  'Data': '#10b981',
  'DevOps': '#f59e0b',
  'Security': '#ef4444',
  'Mobile': '#06b6d4',
  'Cloud': '#6366f1',
  'Database': '#84cc16',
  'Network': '#14b8a6',
  'Language': '#ec4899',
  'Etc': '#9ca3af'
};

export const CATEGORY_ORDER = [...CATEGORIES];

export function getCategoryColor(cat) {
  return CATEGORY_COLORS[cat] || '#9ca3af';
}

export const LOCAL_STORAGE_KEYS = {
  favorites: 'it-ai-glossary:favorites:v1',
  draft: 'it-ai-glossary:admin-draft:v1',
  theme: 'it-ai-glossary:theme'
};

export const CSV_PATH = './terms.csv';
