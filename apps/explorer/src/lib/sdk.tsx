// SDK bootstrap + network context.
//
// All chain access goes through @iota/sdk-wasm — the WASM/TypeScript binding
// of iota-rust-sdk (crates/iota-sdk-ffi compiled to wasm32 via UniFFI). The
// wasm module must be initialised exactly once before any call.

import {
  GraphQlClient,
  initAsync,
  Direction,
  PaginationFilter,
} from "@iota/sdk-wasm";
import React, { createContext, useContext, useMemo, useState } from "react";

// Vite serves/bundles the wasm binary as an asset; initAsync() fetches it.
// "@sdk-wasm-binary" is an alias (vite.config.ts) resolved through the
// installed @iota/sdk-wasm package, so it works standalone and in iotatools.
import wasmUrl from "@sdk-wasm-binary?url";

let booted: Promise<void> | null = null;

// The wasm HTTP layer (reqwest) sets a User-Agent header on every fetch.
// Chromium silently drops it, but Safari forwards it into the CORS preflight
// (`Access-Control-Request-Headers: user-agent`), which the public GraphQL
// endpoints reject — every request fails. Strip the header before dispatch.
// (Upstream fix: don't call .user_agent() on wasm32 in iota-sdk-graphql-client.)
function installFetchShim() {
  const orig = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      if (init?.headers) {
        const h = new Headers(init.headers);
        h.delete("user-agent");
        init = { ...init, headers: h };
      } else if (input instanceof Request && input.headers.has("user-agent")) {
        const clone = new Request(input);
        clone.headers.delete("user-agent");
        input = clone;
      }
    } catch {
      /* never break the request over the shim */
    }
    return orig(input, init);
  };
}

/** Initialise the wasm module once (idempotent). */
export function bootSdk(): Promise<void> {
  if (!booted) {
    installFetchShim();
    booted = initAsync(wasmUrl);
  }
  return booted;
}

export type NetworkId = "mainnet" | "testnet" | "devnet" | "localnet" | "custom";

export interface NetworkDef {
  id: NetworkId;
  label: string;
  url: string;
  make: () => GraphQlClient;
}

// The static factories are typed as returning the interface, but always
// construct the concrete class — cast so optional-parameter overloads apply.
export const NETWORKS: Record<Exclude<NetworkId, "custom">, NetworkDef> = {
  mainnet: {
    id: "mainnet",
    label: "MAINNET",
    url: "https://graphql.mainnet.iota.cafe",
    make: () => GraphQlClient.newMainnet() as GraphQlClient,
  },
  testnet: {
    id: "testnet",
    label: "TESTNET",
    url: "https://graphql.testnet.iota.cafe",
    make: () => GraphQlClient.newTestnet() as GraphQlClient,
  },
  devnet: {
    id: "devnet",
    label: "DEVNET",
    url: "https://graphql.devnet.iota.cafe",
    make: () => GraphQlClient.newDevnet() as GraphQlClient,
  },
  localnet: {
    id: "localnet",
    label: "LOCALNET",
    url: "http://localhost:9125/graphql",
    make: () => GraphQlClient.newLocalnet() as GraphQlClient,
  },
};

const LS_KEY = "tanglescope.network";
const LS_CUSTOM = "tanglescope.customUrl";

interface NetCtx {
  network: NetworkId;
  customUrl: string;
  endpoint: string;
  client: GraphQlClient;
  setNetwork: (n: NetworkId, customUrl?: string) => void;
}

const Ctx = createContext<NetCtx | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [network, setNet] = useState<NetworkId>(() => {
    const saved = localStorage.getItem(LS_KEY) as NetworkId | null;
    return saved && (saved === "custom" || saved in NETWORKS) ? saved : "mainnet";
  });
  const [customUrl, setCustomUrl] = useState<string>(() => localStorage.getItem(LS_CUSTOM) ?? "");

  const client = useMemo<GraphQlClient>(() => {
    if (network === "custom" && customUrl) return new GraphQlClient(customUrl);
    const def = NETWORKS[network === "custom" ? "mainnet" : network];
    return def.make();
  }, [network, customUrl]);

  const endpoint = network === "custom" ? customUrl : NETWORKS[network].url;

  const value: NetCtx = {
    network,
    customUrl,
    endpoint,
    client,
    setNetwork: (n, url) => {
      localStorage.setItem(LS_KEY, n);
      if (n === "custom" && url) {
        localStorage.setItem(LS_CUSTOM, url);
        setCustomUrl(url);
      }
      setNet(n);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNetwork(): NetCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNetwork outside NetworkProvider");
  return ctx;
}

export function useClient(): GraphQlClient {
  return useNetwork().client;
}

// ── pagination helpers ──────────────────────────────────────────────────────
// Convenience wrappers so call sites read as pageFwd(limit)/pageBack(limit).
// (Omitting `direction` used to panic in the generated bindings; fixed in the
// 2026-07 SDK rebuild — these helpers stay for readability.)
// Limits are clamped to the server max page size (50): asking for more makes
// the wasm client trap with `unreachable` instead of returning an error.

const SERVER_MAX_PAGE = 50;

export function pageFwd(limit?: number, cursor?: string) {
  return PaginationFilter.new({
    direction: Direction.Forward,
    cursor: cursor ?? undefined,
    limit: limit != null ? Math.min(limit, SERVER_MAX_PAGE) : undefined,
  });
}

export function pageBack(limit?: number, cursor?: string) {
  return PaginationFilter.new({
    direction: Direction.Backward,
    cursor: cursor ?? undefined,
    limit: limit != null ? Math.min(limit, SERVER_MAX_PAGE) : undefined,
  });
}

/** Normalise SDK/RustPanic errors into a readable message. */
export function errMsg(e: unknown): string {
  if (e instanceof Error) {
    const m = e.message || String(e);
    return m.replace(/^SdkFfiError\.\w+: /, "");
  }
  return String(e);
}
