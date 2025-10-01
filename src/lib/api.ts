import { supabase } from "@/integrations/supabase/client";

const API_BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || undefined;

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
  let url: RequestInfo | URL = input;
  if (typeof input === 'string' && input.startsWith('/') && API_BASE_URL) {
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    url = base + input;
  }
  const res = await fetch(url, { ...init, headers });
  return res;
}


