import { ab as effect, J as untrack, ao as render_effect, E as deep_read_state, a3 as safe_not_equal } from "/iota-utils/assets/index-Cpg3fODn.js";
function action(dom, action2, get_value) {
  effect(() => {
    var payload = untrack(() => action2(dom, get_value == null ? void 0 : get_value()) || {});
    if (get_value && (payload == null ? void 0 : payload.update)) {
      var inited = false;
      var prev = (
        /** @type {any} */
        {}
      );
      render_effect(() => {
        var value = get_value();
        deep_read_state(value);
        if (inited && safe_not_equal(prev, value)) {
          prev = value;
          payload.update(value);
        }
      });
      inited = true;
    }
    if (payload == null ? void 0 : payload.destroy) {
      return () => (
        /** @type {Function} */
        payload.destroy()
      );
    }
  });
}
function formatDateForCoinGecko(dateStr) {
  const [date] = dateStr.split(" ");
  const [yyyy, mm, dd] = date.split("-");
  return `${dd}-${mm}-${yyyy}`;
}
const EPOCH_RATE_LIMIT_MS = 5e3;
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 1e4;
function applyRateLimit(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
async function fetchCoinGeckoPrice(dateStr) {
  var _a, _b, _c, _d;
  const url = `https://api.coingecko.com/api/v3/coins/iota/history?date=${dateStr}`;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const usd = (_b = (_a = data == null ? void 0 : data.market_data) == null ? void 0 : _a.current_price) == null ? void 0 : _b["usd"];
        const eur = (_d = (_c = data == null ? void 0 : data.market_data) == null ? void 0 : _c.current_price) == null ? void 0 : _d["eur"];
        if (typeof usd === "number" || typeof eur === "number") {
          return { usd, eur };
        }
        return null;
      }
      if (res.status === 429) {
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
          console.warn(
            `Rate limited for date ${dateStr}, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`
          );
          await applyRateLimit(delay);
          continue;
        } else {
          console.warn(
            `Rate limit exceeded for date ${dateStr} after ${MAX_RETRIES + 1} attempts`
          );
          return null;
        }
      }
      console.warn(`API error for date ${dateStr}: ${res.status}`);
      return null;
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
        console.warn(
          `Network error for date ${dateStr}: ${error instanceof Error ? error.message : String(error)}, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`
        );
        await applyRateLimit(delay);
        continue;
      } else {
        console.warn(
          `Network error for date ${dateStr} after ${MAX_RETRIES + 1} attempts: ${error instanceof Error ? error.message : String(error)}`
        );
        return null;
      }
    }
  }
  return null;
}
function reloadFromCoinGeckoCache(params) {
  const { epochs, epochEndDates, selectedCurrency, loadedCache } = params;
  const newEpochPrices = {};
  for (let i = 0; i < epochs.length; i++) {
    const dateStr = epochEndDates[i];
    if (!dateStr) continue;
    const formatted = formatDateForCoinGecko(dateStr);
    const cached = loadedCache[formatted];
    if (!cached) continue;
    if (selectedCurrency === "usd" && typeof cached.usd === "number")
      newEpochPrices[epochs[i]] = cached.usd;
    else if (selectedCurrency === "eur" && typeof cached.eur === "number")
      newEpochPrices[epochs[i]] = cached.eur;
  }
  return newEpochPrices;
}
async function fetchAllPrices(params) {
  const { epochs, epochEndDates, selectedCurrency, loadedCache } = params;
  let epochPrices = {};
  let cache = { ...loadedCache };
  const now = /* @__PURE__ */ new Date();
  for (let i = 0; i < epochs.length; i++) {
    const epoch = epochs[i];
    const dateStr = epochEndDates[i];
    if (!dateStr) continue;
    const endDate = new Date(dateStr);
    if (endDate > now) continue;
    const formatted = formatDateForCoinGecko(dateStr);
    const cached = cache[formatted];
    if (cached) {
      if (selectedCurrency === "usd" && typeof cached.usd === "number")
        epochPrices[epoch] = cached.usd;
      else if (selectedCurrency === "eur" && typeof cached.eur === "number")
        epochPrices[epoch] = cached.eur;
      continue;
    }
    let success = false;
    let attempt = 0;
    while (!success && attempt < 5) {
      try {
        const priceData = await fetchCoinGeckoPrice(formatted);
        if (!priceData) throw new Error("No price data for epoch " + epoch);
        const { usd, eur } = priceData;
        if (typeof usd === "number" && selectedCurrency === "usd") epochPrices[epoch] = usd;
        if (typeof eur === "number" && selectedCurrency === "eur") epochPrices[epoch] = eur;
        cache[formatted] = { usd, eur };
        success = true;
      } catch (e) {
        attempt++;
        if (attempt >= 5) {
          return {
            epochPrices,
            updatedCache: cache,
            error: typeof e === "object" && e && "message" in e ? e.message : "Failed to fetch prices"
          };
        }
        await new Promise((r) => setTimeout(r, attempt * 1e4));
      }
    }
    if (i < epochs.length - 1) {
      await applyRateLimit(EPOCH_RATE_LIMIT_MS);
    }
  }
  return { epochPrices, updatedCache: cache };
}
async function fetchCurrentPrice() {
  var _a, _b, _c, _d;
  try {
    const url = "https://api.coingecko.com/api/v3/coins/iota";
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const usd = (_b = (_a = data == null ? void 0 : data.market_data) == null ? void 0 : _a.current_price) == null ? void 0 : _b.usd;
      const eur = (_d = (_c = data == null ? void 0 : data.market_data) == null ? void 0 : _c.current_price) == null ? void 0 : _d.eur;
      if (typeof usd === "number" || typeof eur === "number") {
        return { usd, eur };
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.error("Failed to fetch current price:", err);
    return null;
  }
}
export {
  action as a,
  fetchCurrentPrice as b,
  fetchAllPrices as f,
  reloadFromCoinGeckoCache as r
};
