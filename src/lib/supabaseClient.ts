import { createClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __SUPABASE_URL__?: string;
    __SUPABASE_ANON_KEY__?: string;
  }
}

const SUPABASE_URL =
  (window as any).__SUPABASE_URL__ || localStorage.getItem("invepin_supabase_url") || "";
const SUPABASE_ANON_KEY =
  (window as any).__SUPABASE_ANON_KEY__ ||
  localStorage.getItem("invepin_supabase_anon_key") ||
  "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "public-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export type { User as SupabaseUser } from "@supabase/supabase-js";
