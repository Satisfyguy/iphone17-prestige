import { supabase } from "@/integrations/supabase/client";

export function getToken(): string | null {
  // Deprecated: kept for backward compatibility. We now use Supabase session tokens.
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token || null;
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", headers.get("Content-Type") || "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  const res = await fetch(input, { ...init, headers });
  return res;
}


