import fetch from "node-fetch";

type Provider = "coingecko" | "coinbase";

type RateResult = {
  rate: number;
  provider: Provider;
  fetchedAt: number;
};

const cache: { value?: RateResult } = {};
const CACHE_TTL_MS = 60 * 1000; // 60s

async function fetchFromCoinGecko(): Promise<number> {
  const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=eur", { headers: { "accept": "application/json" } });
  if (!res.ok) throw new Error("coingecko_failed");
  const json = await res.json() as any;
  const eur = json?.tether?.eur;
  if (typeof eur !== "number") throw new Error("coingecko_bad_payload");
  // We need EUR->USDT => 1 EUR equals (1/eur) USDT, since payload is USDT price in EUR.
  // Actually json.tether.eur == price of 1 USDT in EUR => EUR->USDT = 1 / eur.
  return 1 / eur;
}

async function fetchFromCoinbase(): Promise<number> {
  const res = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=EUR", { headers: { "accept": "application/json" } });
  if (!res.ok) throw new Error("coinbase_failed");
  const json = await res.json() as any;
  const usdt = Number(json?.data?.rates?.USDT);
  if (!usdt || Number.isNaN(usdt)) throw new Error("coinbase_bad_payload");
  // Coinbase returns how many USDT for 1 EUR directly when currency=EUR
  return usdt;
}

export async function getEurToUsdtRate(): Promise<RateResult> {
  const now = Date.now();
  if (cache.value && now - cache.value.fetchedAt < CACHE_TTL_MS) {
    return cache.value;
  }

  const providers: Array<() => Promise<{ rate: number; provider: Provider }>> = [
    async () => ({ rate: await fetchFromCoinGecko(), provider: "coingecko" }),
    async () => ({ rate: await fetchFromCoinbase(), provider: "coinbase" }),
  ];

  const errors: string[] = [];
  for (const p of providers) {
    try {
      const { rate, provider } = await p();
      const result: RateResult = { rate, provider, fetchedAt: now };
      cache.value = result;
      return result;
    } catch (e: any) {
      errors.push(String(e?.message || e));
    }
  }

  if (cache.value) return cache.value; // fallback to last good
  throw new Error("rate_unavailable: " + errors.join(","));
}

export function applySpread(amountUsdt: number, spreadBps: number): number {
  return amountUsdt * (1 + spreadBps / 10_000);
}

export function roundUsdt(amount: number): string {
  return amount.toFixed(6); // 6 decimals typical stablecoin
}


