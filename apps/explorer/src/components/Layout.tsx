// App chrome: sidebar nav, topbar with global search, network switcher and
// the live checkpoint ticker.

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { fmtInt } from "../lib/format";
import { resolveQuery, SEARCH_PLACEHOLDER } from "../lib/resolve";
import { NETWORKS, useNetwork, type NetworkId } from "../lib/sdk";
import { Spinner } from "./ui";

const GLYPHS: Record<string, React.ReactNode> = {
  pulse: <path d="M2 12h4l3-8 4 16 3-8h6" />,
  cube: <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 0v20M3 7l9 5 9-5" />,
  tx: <path d="M4 7h13m0 0-4-4m4 4-4 4M20 17H7m0 0 4-4m-4 4 4 4" />,
  epoch: <path d="M12 3a9 9 0 1 0 9 9M12 3v9l6 3M12 3a9 9 0 0 1 9 9h-9" />,
  obj: <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7ZM12 4v16M4 8.5l8 4 8-4" />,
  pkg: <path d="M7 8h10M7 12h10M7 16h6M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />,
  val: <path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6l-8-3Zm-3 9 2.2 2.2L15 10" />,
  ev: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  gql: <path d="M5 8l7-5 7 5v8l-7 5-7-5V8Zm0 0 14 8M19 8 5 16M12 3v18" />,
  chip: <path d="M8 8h8v8H8V8Zm-4 4h2m12 0h2M12 4v2m0 12v2M6 6l1.5 1.5M18 6l-1.5 1.5M6 18l1.5-1.5M18 18l-1.5-1.5" />,
  safe: <path d="M12 3v3m0 12v3M3 12h3m12 0h3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />,
  decode: <path d="M7 4 3 12l4 8M17 4l4 8-4 8M14 5l-4 14" />,
  play: <path d="M6 4v16l6-4V8l8 8V4l-8 8V8L6 4Z" />,
  key: <path d="M15 9a6 6 0 1 0-5.7 6L11 13h2v-2h2l1-1a6 6 0 0 0-1-1Zm-9.5.5h.01M11 13l6 6 2-2m-4 0 2-2" />,
  drop: <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Zm-2 12a2.5 2.5 0 0 0 2.5 2.5" />,
  name: <path d="M7 12a5 5 0 1 1 10 0v3a2 2 0 0 1-4 0v-3a3 3 0 1 0-1 2.2M12 21a9 9 0 1 1 9-9" />,
  chart: <path d="M4 20V10m5.3 10V4m5.4 16v-9m5.3 9V7" />,
};

function Glyph({ name }: { name: string }) {
  return (
    <svg className="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {GLYPHS[name]}
    </svg>
  );
}

const NAV: Array<{ to: string; label: string; glyph: string; end?: boolean } | { label: string }> = [
  { to: "/", label: "Pulse", glyph: "pulse", end: true },
  { label: "LEDGER" },
  { to: "/checkpoints", label: "Checkpoints", glyph: "cube" },
  { to: "/transactions", label: "Transactions", glyph: "tx" },
  { to: "/epochs", label: "Epochs", glyph: "epoch" },
  { to: "/events", label: "Events", glyph: "ev" },
  { to: "/analytics", label: "Analytics", glyph: "chart" },
  { label: "STATE" },
  { to: "/objects", label: "Objects", glyph: "obj" },
  { to: "/packages", label: "Packages", glyph: "pkg" },
  { to: "/validators", label: "Validators", glyph: "val" },
  { to: "/staking", label: "Staking", glyph: "safe" },
  { to: "/names", label: "IOTA Names", glyph: "name" },
  { label: "DEVELOPER" },
  { to: "/graphql", label: "GraphQL Console", glyph: "gql" },
  { to: "/protocol", label: "Protocol Config", glyph: "chip" },
  { to: "/lab/decode", label: "BCS Decoder", glyph: "decode" },
  { to: "/lab/dryrun", label: "Dry Run", glyph: "play" },
];

function SearchBox() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [miss, setMiss] = useState(false);
  const nav = useNavigate();
  const { client } = useNetwork();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = async () => {
    if (!q.trim() || busy) return;
    setBusy(true);
    setMiss(false);
    try {
      const r = await resolveQuery(q, client);
      if (r) {
        setQ("");
        nav(r.to);
      } else {
        setMiss(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="search" title={SEARCH_PLACEHOLDER}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="2.4">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        ref={ref}
        value={q}
        placeholder={miss ? "no match — try an address, digest, checkpoint #, name.iota" : SEARCH_PLACEHOLDER}
        style={miss ? { color: "var(--coral)" } : undefined}
        onChange={(e) => {
          setQ(e.target.value);
          setMiss(false);
        }}
        onKeyDown={(e) => e.key === "Enter" && go()}
      />
      {busy ? <Spinner /> : <kbd>/</kbd>}
    </div>
  );
}

function NetworkSelect() {
  const { network, setNetwork, customUrl } = useNetwork();
  const [showCustom, setShowCustom] = useState(false);
  const [draft, setDraft] = useState(customUrl);

  return (
    <div className="row" style={{ gap: 6 }}>
      <select
        className="input"
        value={network}
        style={{ fontSize: 11, letterSpacing: "0.1em" }}
        onChange={(e) => {
          const v = e.target.value as NetworkId;
          if (v === "custom") {
            setShowCustom(true);
          } else {
            setShowCustom(false);
            setNetwork(v);
          }
        }}
      >
        {Object.values(NETWORKS).map((n) => (
          <option key={n.id} value={n.id}>
            {n.label}
          </option>
        ))}
        <option value="custom">CUSTOM…</option>
      </select>
      {(showCustom || network === "custom") && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) {
              setNetwork("custom", draft.trim());
              setShowCustom(false);
            }
          }}
        >
          <input
            className="input"
            style={{ width: 230 }}
            placeholder="https://graphql.example.org"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </form>
      )}
    </div>
  );
}

function LiveTicker() {
  const { client, network } = useNetwork();
  const { data } = useQuery({
    queryKey: [network, "ticker"],
    queryFn: async () => {
      const seq = await client.latestCheckpointSequenceNumber();
      return seq ?? null;
    },
    refetchInterval: 2500,
  });
  // the epoch changes ~daily — poll it far less often than the checkpoint
  const epochQ = useQuery({
    queryKey: [network, "ticker-epoch"],
    queryFn: async () => {
      const e = await client.epoch();
      return e?.epochId ?? null;
    },
    refetchInterval: 60_000,
  });
  const prev = useRef<bigint | null>(null);
  useEffect(() => {
    if (data != null) prev.current = data;
  }, [data]);
  const prevEpoch = useRef<bigint | null>(null);
  useEffect(() => {
    if (epochQ.data != null) prevEpoch.current = epochQ.data;
  }, [epochQ.data]);
  const v = data ?? prev.current;
  const ep = epochQ.data ?? prevEpoch.current;
  return (
    <div className="ticker">
      {ep != null && (
        <>
          <NavLink to={`/epoch/${ep}`} title="current epoch (client.epoch())" style={{ color: "inherit" }}>
            <span className="tick-label">EPOCH </span>
            <b>{fmtInt(ep)}</b>
          </NavLink>
          <span className="faint">·</span>
        </>
      )}
      <span className="led" />
      <span title="latest checkpoint (polled via GraphQlClient.latestCheckpointSequenceNumber)">
        <span className="tick-label">CP </span>
        <b>{v != null ? fmtInt(v) : "——"}</b>
      </span>
    </div>
  );
}

export function Layout() {
  const { network, endpoint } = useNetwork();
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => setNavOpen(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // .main is the scroll container — reset it when navigating to a new page.
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  // Drawer behaviour: close on Escape, lock body scroll while open.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  return (
    <div className="app">
      <aside className={`sidebar${navOpen ? " open" : ""}`} id="site-nav">
        <div className="brand">
          <img className="brand-mark" src={`${import.meta.env.BASE_URL}tangle.svg`} alt="" />
          <div>
            <div className="brand-name">
              TANGLE<em>SCOPE</em>
            </div>
            <div className="brand-sub">IOTA EXPLORER</div>
          </div>
        </div>
        <nav className="nav">
          {NAV.map((item, i) =>
            "to" in item ? (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeNav}
                className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              >
                <Glyph name={item.glyph} />
                {item.label}
              </NavLink>
            ) : (
              <div key={`label-${i}`} className="nav-label">
                {item.label}
              </div>
            ),
          )}
        </nav>
        <div className="net-block">
          <div className="row spread" style={{ gap: 6 }}>
            <span style={{ letterSpacing: "0.2em" }}>{network.toUpperCase()}</span>
            <span className="led" style={{ width: 6, height: 6 }} />
          </div>
          <span className="faint" style={{ overflowWrap: "anywhere" }}>{endpoint}</span>
          <span className="faint">via @iota/sdk-wasm · uniffi → wasm32</span>
        </div>
      </aside>
      <div className={`sidebar-backdrop${navOpen ? " show" : ""}`} onClick={closeNav} aria-hidden="true" />
      <div className="main" ref={mainRef}>
        <header className="topbar">
          <button
            type="button"
            className="menu-btn"
            aria-label={navOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={navOpen}
            aria-controls="site-nav"
            onClick={() => setNavOpen((v) => !v)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {navOpen ? <path d="M5 5l14 14M19 5 5 19" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
          <div className="topbar-brand">
            <img className="brand-mark" src={`${import.meta.env.BASE_URL}tangle.svg`} alt="" />
            <span className="brand-name">
              TANGLE<em>SCOPE</em>
            </span>
          </div>
          <SearchBox />
          <div style={{ flex: 1 }} />
          <LiveTicker />
          <NetworkSelect />
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
