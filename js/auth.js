// glossary/js/auth.js - Supabase Auth 기반
import { supabase } from './supabase.js';

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem('it-ai-glossary:supabase-auth');
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function isAuthed() {
  const session = await getSession();
  return !!session;
}

export function onAuthChange(cb) {
  return supabase.auth.onAuthStateChange((event, session) => {
    cb(event, session);
  });
}

// 기존 호환용 (더 이상 sha256 비번 사용 안함)
export async function checkPassword() { return false; }
export function setAuthed() {}
