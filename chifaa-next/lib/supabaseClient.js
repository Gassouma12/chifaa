'use client';
import { createClient } from '@supabase/supabase-js';

// Browser client for the admin SPA. Uses the PUBLIC anon key (safe to ship);
// RLS enforces that only an authenticated admin can write. Auth session is
// persisted so a refresh keeps you logged in.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

// Resolve a stored image path (assets/... or uploads/...) to a displayable URL.
// Full URLs (http/data) pass through unchanged.
export function mediaUrl(pathOrUrl) {
  if (!pathOrUrl) return '';
  if (/^(https?:|data:|blob:)/i.test(pathOrUrl)) return pathOrUrl;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/media/${String(pathOrUrl).replace(/^\/+/, '')}`;
}
