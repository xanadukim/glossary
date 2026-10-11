// glossary/js/supabase.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// 연결 테스트
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('terms').select('id').limit(1);
    if (error) throw error;
    return { ok: true, count: data?.length || 0 };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
