import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://rhigaegceftzmyxivfph.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || "";

if (!SUPABASE_SERVICE_ROLE_KEY) {
  // In dev we allow empty to avoid crashing; endpoints will fail clearly if used
  console.warn("Supabase service role key is not set. Set SUPABASE_SERVICE_ROLE_KEY in the server environment.");
}

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});


