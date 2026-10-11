
import { ADMIN_PASSWORD_HASH } from './config.js';
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
export async function checkPassword(pw) {
  const hash = await sha256(pw);
  return hash === ADMIN_PASSWORD_HASH;
}
export function isAuthed() {
  return sessionStorage.getItem('adminAuth') === 'ok';
}
export function setAuthed() {
  sessionStorage.setItem('adminAuth','ok');
}
export function logout() {
  sessionStorage.removeItem('adminAuth');
}
