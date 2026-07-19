// Full account view: balance breakdown (available / staked / rewards / total),
// portfolio of coin holdings, Display-rendered assets, staking positions,
// raw owned objects, sent / affected transactions, and IOTA-Names identity.

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Address, NameFormat, ObjectFilter, ObjectId, TransactionsFilter, transactionToJson } from "@iota/sdk-wasm";
import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Age,
  Amount,
  Empty,
  ErrorNote,
  Hash,
  LoadingBlock,
  ObjectLink,
  Pager,
  Pill,
  Section,
  Spinner,
  Stat,
  Tabs,
  TxLink,
  TypePill,
  useTabParam,
} from "../components/ui";
import { Info, TERMS } from "../components/Info";
import { JsonTree } from "../components/JsonTree";
import { parseRunQuery } from "../lib/checkpoints";
import { fmtInt, fmtIota, normalizeTypeTag, shortType, splitTypeTag, toBig } from "../lib/format";
import { addressBalances, addressStakes, addressTxFeed, ownedObjectsWithDisplay } from "../lib/gql";
import type { AssetRow, StakeRow } from "../lib/gql";
import { usePagedList } from "../lib/paging";
import { pageFwd, useClient, useNetwork } from "../lib/sdk";
import { kindTag, summarizeKind, unwrapV1 } from "../lib/tx";

const isIotaType = (t: string) => t.endsWith("::iota::IOTA");
const isCoinType = (t: string) => t.includes("::coin::Coin<");

/** Scale a raw base-unit amount by `decimals` (coin metadata), bigint-safe. */
function fmtScaled(raw: string, decimals: number, maxFrac = 4): string {
  try {
    const b = BigInt(raw);
    if (decimals <= 0) return fmtInt(b);
    const base = 10n ** BigInt(decimals);
    const neg = b < 0n;
    const abs = neg ? -b : b;
    const whole = abs / base;
    const frac = (abs % base).toString().padStart(decimals, "0").slice(0, maxFrac).replace(/0+$/, "");
    return `${neg ? "-" : ""}${fmtInt(whole)}${frac ? "." + frac : ""}`;
  } catch {
    return fmtInt(raw);
  }
}

function StakeStatusPill({ status }: { status: string }) {
  const s = (status || "").toUpperCase();
  if (s === "ACTIVE") return <Pill color="teal">ACTIVE</Pill>;
  if (s === "PENDING") return <Pill color="amber">PENDING</Pill>;
  return <Pill>{s || "—"}</Pill>;
}

/** One Display-rendered asset card; falls back to a letter tile when the
 *  object has no usable image. */
function AssetCard({ row }: { row: AssetRow }) {
  const [imgErr, setImgErr] = useState(false);
  const d = row.display ?? {};
  const rawImg = d["image_url"] ?? d["img_url"] ?? d["image"] ?? null;
  const img = rawImg ? rawImg.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/") : null;
  const name = d["name"] || shortType(row.type);
  const letter = (splitTypeTag(row.type)?.name ?? row.type.replace(/^0x/, "")).charAt(0).toUpperCase() || "?";
  return (
    <Link className="asset-card" to={`/object/${row.objectId}`}>
      {img && !imgErr ? (
        <img className="thumb" src={img} alt="" loading="lazy" onError={() => setImgErr(true)} />
      ) : (
        <div className="thumb-fallback">{letter}</div>
      )}
      <div className="meta">
        <div className="name" title={name}>{name}</div>
        <div className="sub" title={`${row.objectId} · ${row.type}`}>
          {row.objectId.slice(0, 10)}…{row.objectId.slice(-6)}
        </div>
      </div>
    </Link>
  );
}

// ── owned objects: inline Move contents ──────────────────────────────────────

interface ObjectRow {
  id: string;
  type: string;
  version: bigint;
  digest: string;
  /** digest of the transaction that last wrote this object (previousTransaction) */
  prevTx: string;
}

/** Coin<T> Move contents expose the balance either as the bare u64 value or as
 *  a nested { value } — accept both shapes. */
function coinBalanceValue(contents: any): string | null {
  const b = contents?.balance;
  if (b == null) return null;
  if (typeof b === "string" || typeof b === "number") return String(b);
  if (typeof b === "object" && b.value != null) return String(b.value);
  return null;
}

/** Lazily-fetched Move contents for one owned object, rendered when its row is
 *  expanded. Coin objects lead with the balance parsed to IOTA + nanos (native
 *  IOTA) or raw base units (other coin types); every other type just shows the
 *  contents JSON, the same view as the object page's Move-contents section. */
function OwnedObjectContents({ id, type }: { id: string; type: string }) {
  const client = useClient();
  const { network } = useNetwork();
  const q = useQuery({
    queryKey: [network, "owned-obj-contents", id],
    queryFn: async () => {
      const raw = await client.moveObjectContents(ObjectId.fromHex(id), undefined);
      return raw != null ? parseRunQuery(raw) : null;
    },
  });
  if (q.isPending) return <LoadingBlock label="moveObjectContents(id)…" />;
  if (q.error) return <ErrorNote error={q.error} />;
  if (q.data == null) return <Empty>contents unavailable (not a Move object, or pruned)</Empty>;

  const balance = isCoinType(type) ? coinBalanceValue(q.data) : null;
  const nativeIota = type.includes("::iota::IOTA");
  const inner = splitTypeTag(type)?.generics?.replace(/^<|>$/g, "") ?? null;

  return (
    <>
      {balance != null && (
        <div className="row mono" style={{ gap: 8, marginBottom: 8 }}>
          <span className="faint small" style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}>Balance</span>
          {nativeIota ? (
            <span style={{ fontSize: 14 }}>
              {fmtIota(balance)} <span className="faint">({fmtInt(balance)} nanos)</span>
            </span>
          ) : (
            <span style={{ fontSize: 14 }}>
              {fmtInt(balance)} <span className="faint">base units{inner ? ` · ${shortType(inner)}` : ""}</span>
            </span>
          )}
        </div>
      )}
      <JsonTree data={q.data} />
    </>
  );
}

/** One owned-object table row: click anywhere to expand its Move contents; the
 *  object link still navigates and the type cell still drives the type facet. */
function OwnedObjectRow({ r, onToggleType }: { r: ObjectRow; onToggleType: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr style={{ cursor: "pointer" }} onClick={() => setOpen((v) => !v)} title="click to show the object's Move contents">
        <td>
          <span className="dim" style={{ display: "inline-block", width: 12 }}>{open ? "▾" : "▸"}</span>
          <span onClick={(e) => e.stopPropagation()}>
            <ObjectLink id={r.id} />
          </span>
        </td>
        <td
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleType(r.type);
          }}
          title="click to filter by this type"
        >
          <TypePill type={r.type} />
        </td>
        <td className="num dim">{String(r.version)}</td>
        <td className="dim" onClick={(e) => e.stopPropagation()}>
          <Hash value={r.digest} />
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <TxLink digest={r.prevTx} />
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={5} style={{ whiteSpace: "normal", padding: "10px 14px" }}>
            <OwnedObjectContents id={r.id} type={r.type} />
          </td>
        </tr>
      )}
    </>
  );
}

export default function AddressPage() {
  const { addr = "" } = useParams();
  const client = useClient();
  const { network } = useNetwork();
  const [tab, setTab] = useTabParam("portfolio");
  const [coinObjsOpen, setCoinObjsOpen] = useState(false);

  const addrHex = useMemo(() => {
    try {
      return Address.fromHex(addr).toHex();
    } catch {
      try {
        return Address.fromShortHex(addr.startsWith("0x") ? addr : `0x${addr}`).toHex();
      } catch {
        return null;
      }
    }
  }, [addr]);

  // ── header: available balance + IOTA-Names ────────────────────────────────
  const head = useQuery({
    queryKey: [network, "addr-head", addrHex],
    enabled: !!addrHex,
    queryFn: async () => {
      const a = Address.fromHex(addrHex!);
      const [balance, name] = await Promise.all([
        client.balance(a).catch(() => null),
        client.iotaNamesDefaultName(a, NameFormat.Dot).catch(() => null),
      ]);
      return { balance, name: name != null ? name.format(NameFormat.Dot) : null };
    },
  });

  // ── staking positions (always fetched: the header totals need them) ──────
  const stakes = useQuery({
    queryKey: [network, "addr-stakes", addrHex],
    enabled: !!addrHex,
    queryFn: () => addressStakes(client, addrHex!),
  });

  const stakeSums = useMemo(() => {
    if (!stakes.data) return { principal: null as bigint | null, reward: null as bigint | null };
    let principal = 0n;
    let reward: bigint | null = null;
    for (const s of stakes.data) {
      try {
        principal += BigInt(s.principal);
        if (s.estimatedReward != null) reward = (reward ?? 0n) + BigInt(s.estimatedReward);
      } catch {
        /* skip malformed amounts */
      }
    }
    return { principal, reward };
  }, [stakes.data]);

  const available = toBig(head.data?.balance ?? null);
  const total = available != null && stakeSums.principal != null ? available + stakeSums.principal : available;

  // ── portfolio: grouped coin balances + metadata for non-IOTA types ───────
  const portfolio = useQuery({
    queryKey: [network, "addr-balances", addrHex],
    enabled: !!addrHex && tab === "portfolio",
    queryFn: () => addressBalances(client, addrHex!),
  });

  const metaTypes = useMemo(
    () => (portfolio.data ?? []).map((r) => r.coinType).filter((t) => !isIotaType(t)).slice(0, 8),
    [portfolio.data],
  );

  const coinMeta = useQuery({
    queryKey: [network, "addr-coinmeta", addrHex, metaTypes.join("|")],
    enabled: !!addrHex && metaTypes.length > 0,
    staleTime: Infinity,
    queryFn: async () => {
      const entries = await Promise.all(
        metaTypes.map(async (t) => {
          try {
            const m = await client.coinMetadata(t);
            return [t, m ? { decimals: m.decimals ?? null, symbol: m.symbol ?? null } : null] as const;
          } catch {
            return [t, null] as const;
          }
        }),
      );
      return Object.fromEntries(entries) as Record<string, { decimals: number | null; symbol: string | null } | null>;
    },
  });

  // individual coin objects (developer drill-down under Portfolio)
  const coins = usePagedList({
    queryKey: [network, "addr-coins", addrHex],
    limit: 24,
    enabled: !!addrHex && tab === "portfolio" && coinObjsOpen,
    fetcher: (p) => client.coins(Address.fromHex(addrHex!), p, undefined),
  });

  // ── assets: owned objects with Display metadata, cursor-appended ─────────
  const assets = useInfiniteQuery({
    queryKey: [network, "addr-assets", addrHex],
    enabled: !!addrHex && tab === "assets",
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => ownedObjectsWithDisplay(client, addrHex!, pageParam, 24),
    getNextPageParam: (last) => (last.hasNext && last.endCursor ? last.endCursor : undefined),
  });
  const assetRows = useMemo(() => {
    const all = assets.data?.pages.flatMap((p) => p.rows) ?? [];
    return all.filter((r) => !isCoinType(r.type)); // plain coins live in Portfolio
  }, [assets.data]);

  // ── raw owned objects: cursor-appended so pages accumulate on screen ─────
  const OBJ_PAGE = 48;
  const OBJ_LOAD_ALL_CAP = 2000;
  const objects = useInfiniteQuery({
    queryKey: [network, "addr-objects", addrHex],
    enabled: !!addrHex && tab === "objects",
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const page = await client.objects(
        ObjectFilter.new({ owner: Address.fromHex(addrHex!) }),
        pageFwd(OBJ_PAGE, pageParam),
      );
      return {
        rows: page.data.map((o) => ({
          id: o.id().toHex(),
          type: normalizeTypeTag(String(o.objectType())),
          version: o.version().asU64(),
          digest: o.digest().toBase58(),
          prevTx: o.previousTransaction().toBase58(),
        })),
        hasNext: page.pageInfo.hasNextPage,
        endCursor: page.pageInfo.endCursor ?? undefined,
      };
    },
    getNextPageParam: (last) => (last.hasNext && last.endCursor ? last.endCursor : undefined),
  });
  const objectRows = useMemo(() => objects.data?.pages.flatMap((p) => p.rows) ?? [], [objects.data]);

  const [loadingAllObjects, setLoadingAllObjects] = useState(false);
  const loadAllObjects = async () => {
    setLoadingAllObjects(true);
    try {
      let res = await objects.fetchNextPage();
      while (
        res.hasNextPage &&
        (res.data?.pages.reduce((n, p) => n + p.rows.length, 0) ?? 0) < OBJ_LOAD_ALL_CAP
      ) {
        res = await objects.fetchNextPage();
      }
    } finally {
      setLoadingAllObjects(false);
    }
  };

  // client-side type facet over everything loaded so far
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [typeSearch, setTypeSearch] = useState("");
  const typeFacets = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of objectRows) m.set(r.type, (m.get(r.type) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [objectRows]);
  const visibleObjects = useMemo(
    () =>
      objectRows.filter((r) => {
        if (typeFilter && r.type !== typeFilter) return false;
        if (typeSearch && !r.type.toLowerCase().includes(typeSearch.toLowerCase())) return false;
        return true;
      }),
    [objectRows, typeFilter, typeSearch],
  );

  // ── activity feed: one GraphQL query per page brings digest + time +
  // status + balance changes, rendered as a human-readable feed ────────────
  const [feedMode, setFeedMode] = useState<"recv" | "sent">("recv");
  const feed = useInfiniteQuery({
    queryKey: [network, "addr-feed", addrHex, feedMode],
    enabled: !!addrHex && tab === "activity",
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => addressTxFeed(client, addrHex!, feedMode, pageParam),
    getNextPageParam: (last) => (last.hasMore && last.nextCursor ? last.nextCursor : undefined),
  });
  const feedRows = useMemo(() => feed.data?.pages.flatMap((p) => p.rows) ?? [], [feed.data]);

  if (!addrHex) return <ErrorNote error={new Error(`"${addr}" is not a valid address`)} />;

  return (
    <>
      <div className="page-head">
        <div className="crumbs">ADDRESS</div>
        <h1>
          ACCOUNT
          {head.data?.name && <Pill color="teal">◈ {head.data.name}</Pill>}
        </h1>
        <div className="sub mono" style={{ overflowWrap: "anywhere" }}>{addrHex}</div>
      </div>

      <div className="stat-grid">
        <Stat
          label="Available"
          value={
            <Info tip="Spendable coins owned directly by this address — what wallets show as the balance. Staked funds are not included.">
              {head.isPending ? "…" : available != null ? fmtIota(available, { maxFrac: 4, unit: false }) : "0"}
            </Info>
          }
          hint={available != null ? `${fmtInt(available)} nanos` : undefined}
        />
        <Stat
          label="Staked"
          value={
            <Info tip={TERMS.delegation}>
              {stakes.isPending ? "…" : stakeSums.principal != null ? fmtIota(stakeSums.principal, { maxFrac: 4, unit: false }) : "—"}
            </Info>
          }
          hint={stakeSums.principal != null ? `${fmtInt(stakeSums.principal)} nanos` : undefined}
          color="violet"
        />
        <Stat
          label="Est. rewards"
          value={
            <Info tip="Staking rewards accrued so far on this address's active stakes, as estimated by the indexer. Paid out when the stake is withdrawn.">
              {stakes.isPending ? "…" : stakeSums.reward != null ? fmtIota(stakeSums.reward, { maxFrac: 4, unit: false }) : "—"}
            </Info>
          }
          hint={stakeSums.reward != null ? `${fmtInt(stakeSums.reward)} nanos` : undefined}
          color="amber"
        />
        <Stat
          label="Total"
          value={
            <Info tip="Available + staked principal (estimated rewards not included).">
              {head.isPending || stakes.isPending ? "…" : total != null ? fmtIota(total, { maxFrac: 4, unit: false }) : "—"}
            </Info>
          }
          hint={total != null ? `${fmtInt(total)} nanos` : undefined}
          color="blue"
        />
        <Stat
          label="IOTA-Names"
          value={head.data?.name ? <Info tip={TERMS.iotaNames}>{head.data.name}</Info> : "—"}
          color="violet"
          hint="iotaNamesDefaultName(address)"
        />
      </div>

      <Tabs
        tabs={[
          { id: "portfolio", label: "Portfolio" },
          { id: "assets", label: "Assets" },
          { id: "staking", label: "Staking", count: stakes.data?.length || undefined },
          { id: "objects", label: "Objects" },
          { id: "activity", label: "Activity" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "portfolio" && (
        <>
          {portfolio.isPending ? (
            <LoadingBlock label="address.balances via GraphQL…" />
          ) : portfolio.error ? (
            <ErrorNote error={portfolio.error} />
          ) : portfolio.data!.length === 0 ? (
            <Empty>no coin balances for this address</Empty>
          ) : (
            <Section
              index="01"
              title="Portfolio"
              aux={<Info tip="All coin types held by this address, grouped by the indexer across every individual coin object.">grouped balances</Info>}
            >
              <div className="panel tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th><Info tip={TERMS.coinType}>COIN</Info></th>
                      <th className="num"><Info tip={TERMS.coinMetadata}>BALANCE</Info></th>
                      <th className="num">OBJECTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.data!.map((b) => {
                      const native = isIotaType(b.coinType);
                      const meta = coinMeta.data?.[b.coinType] ?? null;
                      return (
                        <tr key={b.coinType}>
                          <td>
                            <Link to={`/coin/${encodeURIComponent(b.coinType)}`}>
                              <TypePill type={b.coinType} />
                            </Link>{" "}
                            {native && <Pill color="teal">native</Pill>}
                          </td>
                          <td className="num">
                            {native ? (
                              <Amount nanos={b.totalBalance} />
                            ) : meta?.decimals != null ? (
                              <span className="mono" title={`${fmtInt(b.totalBalance)} base units · ${meta.decimals} decimals`}>
                                {fmtScaled(b.totalBalance, meta.decimals)}
                                {meta.symbol ? ` ${meta.symbol}` : ""}
                              </span>
                            ) : (
                              <Info tip="Raw amount in base units — display decimals come from the coin's on-chain metadata, which isn't loaded for this type.">
                                <span className="mono">{fmtInt(b.totalBalance)}</span>
                              </Info>
                            )}
                          </td>
                          <td className="num dim">{fmtInt(b.coinObjectCount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {!portfolio.isPending && !portfolio.error && portfolio.data!.length > 0 && (
            <Section
              index="02"
              title="Coin objects"
              aux={<span className="mono">client.coins(address)</span>}
            >
              {!coinObjsOpen ? (
                <button className="btn ghost" onClick={() => setCoinObjsOpen(true)}>
                  show individual coin objects ▸
                </button>
              ) : coins.isPending ? (
                <LoadingBlock label="coins(address)…" />
              ) : coins.error ? (
                <ErrorNote error={coins.error} />
              ) : coins.rows.length === 0 ? (
                <Empty>no coin objects</Empty>
              ) : (
                <>
                  <div className="panel tbl-wrap">
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>COIN OBJECT</th>
                          <th>TYPE</th>
                          <th className="num">BALANCE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coins.rows.map((c) => {
                          const oid = c.id().toHex();
                          return (
                            <tr key={oid}>
                              <td><ObjectLink id={oid} /></td>
                              <td><TypePill type={String(c.coinType())} /></td>
                              <td className="num"><Amount nanos={c.balance()} /></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <Pager hasNext={coins.hasMore} onNext={coins.next} onReset={coins.reset} page={coins.page} loading={coins.isFetching} />
                </>
              )}
            </Section>
          )}
        </>
      )}

      {tab === "assets" &&
        (assets.isPending ? (
          <LoadingBlock label="objects(owner) + display via GraphQL…" />
        ) : assets.error ? (
          <ErrorNote error={assets.error} />
        ) : (
          <Section
            index="01"
            title="Assets"
            aux={
              <Info tip="Objects can register Display metadata on-chain — a human-readable name, image and description. That's what marketplaces and wallets render. Plain coins are excluded here (see Portfolio).">
                display objects
              </Info>
            }
          >
            {assetRows.length === 0 ? (
              <Empty>
                no display assets{assets.hasNextPage ? " on this page — try load more" : ""}
              </Empty>
            ) : (
              <div className="asset-grid">
                {assetRows.map((r) => (
                  <AssetCard key={r.objectId} row={r} />
                ))}
              </div>
            )}
            {assets.hasNextPage && (
              <div className="pager">
                <button className="btn ghost" disabled={assets.isFetchingNextPage} onClick={() => assets.fetchNextPage()}>
                  {assets.isFetchingNextPage ? <Spinner /> : "load more ↓"}
                </button>
              </div>
            )}
          </Section>
        ))}

      {tab === "staking" &&
        (stakes.isPending ? (
          <LoadingBlock label="address.stakedIotas via GraphQL…" />
        ) : stakes.error ? (
          <ErrorNote error={stakes.error} />
        ) : stakes.data!.length === 0 ? (
          <Empty>no staking positions</Empty>
        ) : (
          <Section index="01" title="Staking positions" aux={<Info tip={TERMS.delegation}>StakedIota objects</Info>}>
            <div className="panel tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th className="num"><Info tip="The amount of IOTA originally staked — returned in full when the stake is withdrawn.">PRINCIPAL</Info></th>
                    <th>STATUS</th>
                    <th className="num"><Info tip={TERMS.epoch}>ACTIVATED EPOCH</Info></th>
                    <th className="num">EST. REWARD</th>
                    <th><Info tip="The validator staking pool this position belongs to.">POOL</Info></th>
                  </tr>
                </thead>
                <tbody>
                  {stakes.data!.map((s: StakeRow, i: number) => {
                    const poolId =
                      typeof s.json?.pool_id === "string" ? s.json.pool_id : typeof s.json?.poolId === "string" ? s.json.poolId : null;
                    return (
                      <tr key={typeof s.json?.id === "string" ? s.json.id : i}>
                        <td className="num"><Amount nanos={s.principal} /></td>
                        <td><StakeStatusPill status={s.status} /></td>
                        <td className="num">
                          {s.activatedEpoch != null ? (
                            <Link to={`/epoch/${s.activatedEpoch}`} className="mono">{fmtInt(s.activatedEpoch)}</Link>
                          ) : (
                            <span className="faint">—</span>
                          )}
                        </td>
                        <td className="num">{s.estimatedReward != null ? <Amount nanos={s.estimatedReward} /> : <span className="faint">—</span>}</td>
                        <td>{poolId ? <ObjectLink id={poolId} /> : <span className="faint">—</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>
        ))}

      {tab === "objects" &&
        (objects.isPending ? (
          <LoadingBlock label="objects(filter: { owner })…" />
        ) : objects.error ? (
          <ErrorNote error={objects.error} />
        ) : objectRows.length === 0 ? (
          <Empty>no objects owned by this address</Empty>
        ) : (
          <>
            <Section
              index="00"
              title="Filter by type"
              aux={`${typeFacets.length} distinct type${typeFacets.length === 1 ? "" : "s"} loaded${objects.hasNextPage ? " so far — load all for the full picture" : ""}`}
            >
              <div className="panel pad">
                <div className="row" style={{ gap: 6 }}>
                  <button
                    className="pill"
                    style={{ cursor: "pointer", background: typeFilter == null ? "var(--teal-dim)" : "none", color: typeFilter == null ? "var(--teal)" : undefined }}
                    onClick={() => setTypeFilter(null)}
                  >
                    all · {objectRows.length}
                  </button>
                  {typeFacets.slice(0, 14).map(([t, n]) => (
                    <button
                      key={t}
                      className={`pill${typeFilter === t ? " teal" : ""}`}
                      style={{ cursor: "pointer" }}
                      title={t}
                      onClick={() => setTypeFilter(typeFilter === t ? null : t)}
                    >
                      <span className="trunc">{shortType(t)}</span> · {n}
                    </button>
                  ))}
                  {typeFacets.length > 14 && (
                    <span className="faint small">+{typeFacets.length - 14} more types — use the text filter</span>
                  )}
                </div>
                <div className="row" style={{ gap: 10, marginTop: 10 }}>
                  <input
                    className="input"
                    style={{ flex: 1, maxWidth: 360 }}
                    placeholder="filter types by text… e.g. nft, coin, registration"
                    value={typeSearch}
                    onChange={(e) => setTypeSearch(e.target.value)}
                  />
                  {(typeFilter || typeSearch) && (
                    <button className="btn ghost" onClick={() => { setTypeFilter(null); setTypeSearch(""); }}>
                      clear filter
                    </button>
                  )}
                </div>
              </div>
            </Section>

            <Section
              index="01"
              title="Owned objects"
              aux={
                <>
                  showing {visibleObjects.length} of {objectRows.length} loaded
                  {objects.hasNextPage ? "+" : " (complete)"} · click a row for its Move contents
                </>
              }
            >
              <div className="panel tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th><Info tip={TERMS.objectId}>OBJECT</Info></th>
                      <th>TYPE</th>
                      <th className="num"><Info tip={TERMS.objectVersion}>VERSION</Info></th>
                      <th><Info tip={TERMS.objectDigest}>DIGEST</Info></th>
                      <th><Info tip="The transaction that last wrote this object (its previousTransaction). Open it to see exactly how the object reached its current state.">LAST TX</Info></th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleObjects.map((r) => (
                      <OwnedObjectRow
                        key={r.id}
                        r={r}
                        onToggleType={(t) => setTypeFilter(typeFilter === t ? null : t)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pager">
                <span>
                  {objectRows.length} loaded{objects.hasNextPage ? "" : " · complete"}
                </span>
                {objects.hasNextPage && (
                  <>
                    <button
                      className="btn ghost"
                      disabled={objects.isFetchingNextPage || loadingAllObjects}
                      onClick={() => objects.fetchNextPage()}
                    >
                      {objects.isFetchingNextPage && !loadingAllObjects ? <Spinner /> : `load ${OBJ_PAGE} more ⇣`}
                    </button>
                    <button
                      className="btn ghost"
                      disabled={loadingAllObjects}
                      onClick={loadAllObjects}
                      title={`fetches every page (capped at ${OBJ_LOAD_ALL_CAP} objects)`}
                    >
                      {loadingAllObjects ? <><Spinner /> loading all…</> : "load all ⇊"}
                    </button>
                  </>
                )}
                {!objects.hasNextPage && objectRows.length >= OBJ_LOAD_ALL_CAP && (
                  <span className="faint">capped at {OBJ_LOAD_ALL_CAP}</span>
                )}
              </div>
            </Section>
          </>
        ))}

      {tab === "activity" && (
        <Section
          index="01"
          title="Activity"
          aux={
            <span className="row" style={{ gap: 6, display: "inline-flex" }}>
              <button
                className={`pill${feedMode === "recv" ? " teal" : ""}`}
                style={{ cursor: "pointer", background: feedMode === "recv" ? undefined : "transparent" }}
                onClick={() => setFeedMode("recv")}
                title="every transaction that touched this address (received funds, mutated its objects, …)"
              >
                ALL AFFECTING
              </button>
              <button
                className={`pill${feedMode === "sent" ? " teal" : ""}`}
                style={{ cursor: "pointer", background: feedMode === "sent" ? undefined : "transparent" }}
                onClick={() => setFeedMode("sent")}
                title="only transactions signed and sent by this address"
              >
                SENT
              </button>
            </span>
          }
        >
          {feed.isPending ? (
            <LoadingBlock label="transactionBlocks + balanceChanges via GraphQL…" />
          ) : feed.error ? (
            <ErrorNote error={feed.error} />
          ) : feedRows.length === 0 ? (
            <Empty>{feedMode === "sent" ? "no transactions sent" : "no activity yet"}</Empty>
          ) : (
            <>
              <div className="panel tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th></th>
                      <th className="num">IOTA CHANGE</th>
                      <th>WHAT</th>
                      <th>TRANSACTION</th>
                      <th>AGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedRows.map((r) => {
                      const sentByMe = r.sender === addrHex;
                      const dir = r.netIota > 0n ? "in" : r.netIota < 0n ? "out" : "none";
                      const what = r.isSystem
                        ? "system"
                        : sentByMe
                          ? dir === "out"
                            ? "sent"
                            : dir === "in"
                              ? "received (self-sent tx)"
                              : "interaction"
                          : dir === "in"
                            ? "received"
                            : "affected";
                      return (
                        <tr key={r.digest}>
                          <td>
                            {r.success === false ? (
                              <Pill color="coral" title="execution failed — gas was still charged">✕</Pill>
                            ) : dir === "in" ? (
                              <span style={{ color: "var(--teal)" }}>↓</span>
                            ) : dir === "out" ? (
                              <span style={{ color: "var(--coral)" }}>↑</span>
                            ) : (
                              <span className="faint">·</span>
                            )}
                          </td>
                          <td
                            className="num"
                            style={{ color: dir === "in" ? "var(--teal)" : dir === "out" ? "var(--coral)" : "var(--ink-faint)" }}
                            title={`${fmtInt(r.netIota)} nanos net`}
                          >
                            {r.netIota === 0n ? "±0" : `${r.netIota > 0n ? "+" : "−"}${fmtIota(r.netIota < 0n ? -r.netIota : r.netIota, { unit: false })}`}
                            {r.otherCoinChanges > 0 && (
                              <span className="faint" title="this transaction also moved other coin types">
                                {" "}+{r.otherCoinChanges} coin{r.otherCoinChanges > 1 ? "s" : ""}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="dim">{what}</span>
                            {r.counterparty && (
                              <span className="dim">
                                {" "}
                                {dir === "in" ? "from" : "to"} <Hash value={r.counterparty} to={`/address/${r.counterparty}`} head={6} tail={4} copy={false} />
                              </span>
                            )}
                            {!sentByMe && !r.isSystem && r.sender && !r.counterparty && (
                              <span className="dim">
                                {" "}
                                by <Hash value={r.sender} to={`/address/${r.sender}`} head={6} tail={4} copy={false} />
                              </span>
                            )}
                          </td>
                          <td>
                            <TxLink digest={r.digest} />
                          </td>
                          <td className="dim">{r.timestampMs != null ? <Age ms={r.timestampMs} /> : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="pager">
                <span>
                  {feedRows.length} loaded{feed.hasNextPage ? "" : " · complete"}
                </span>
                {feed.hasNextPage && (
                  <button className="btn ghost" disabled={feed.isFetchingNextPage} onClick={() => feed.fetchNextPage()}>
                    {feed.isFetchingNextPage ? <Spinner /> : "load 20 more ⇣"}
                  </button>
                )}
              </div>
            </>
          )}
        </Section>
      )}
    </>
  );
}
