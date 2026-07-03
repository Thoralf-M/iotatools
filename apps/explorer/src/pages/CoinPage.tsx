// Coin detail: on-chain metadata (symbol, name, decimals, icon), total supply
// scaled by the coin's own decimals, links to the metadata object and the
// defining package, plus a sample of live Coin<T> objects of this type.
//
// Routed at /coin/:type with a URL-encoded type tag, e.g.
// /coin/0x2%3A%3Aiota%3A%3AIOTA → "0x2::iota::IOTA".

import { useQuery } from "@tanstack/react-query";
import { ObjectFilter } from "@iota/sdk-wasm";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Info, TERMS } from "../components/Info";
import { JsonTree } from "../components/JsonTree";
import {
  CopyBtn,
  Empty,
  ErrorNote,
  Hash,
  LoadingBlock,
  ObjectLink,
  Pager,
  Pill,
  Section,
  Stat,
  Tabs,
  useTabParam,
} from "../components/ui";
import { fmtInt, splitTypeTag, toBig } from "../lib/format";
import { usePagedList } from "../lib/paging";
import { useClient, useNetwork } from "../lib/sdk";

/** Insert the decimal point into a raw base-unit amount and group digits.
 *  fmtIota only handles 9 decimals (nanos→IOTA); this works for any coin. */
function scale(amount: bigint, decimals: number): string {
  const neg = amount < 0n;
  const abs = neg ? -amount : amount;
  if (decimals <= 0) return (neg ? "-" : "") + fmtInt(abs);
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  const frac = (abs % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${neg ? "-" : ""}${fmtInt(whole)}${frac ? "." + frac : ""}`;
}

/** True for 0x2::iota::IOTA in short or canonical long form. */
function isNativeIota(type: string): boolean {
  const p = splitTypeTag(type);
  if (!p || p.generics) return false;
  try {
    return p.module === "iota" && p.name === "IOTA" && BigInt(p.pkg) === 2n;
  } catch {
    return false;
  }
}

export default function CoinPage() {
  const { type: rawParam = "" } = useParams();
  let type: string;
  try {
    type = decodeURIComponent(rawParam).trim();
  } catch {
    type = rawParam.trim();
  }

  const client = useClient();
  const { network } = useNetwork();
  const [tab, setTab] = useTabParam("objects");
  const [iconBroken, setIconBroken] = useState(false);

  const parts = splitTypeTag(type);
  const native = isNativeIota(type);

  const q = useQuery({
    queryKey: [network, "coin", type],
    queryFn: async () => {
      // Both return undefined (no throw) for unregistered coin types.
      const [meta, supply] = await Promise.all([
        client.coinMetadata(type),
        client.totalSupply(type).catch(() => undefined),
      ]);
      return { meta: meta ?? null, supply: supply ?? null };
    },
  });

  const objs = usePagedList({
    queryKey: [network, "coin-objects", type],
    limit: 20,
    enabled: tab === "objects",
    fetcher: (p) => client.objects(ObjectFilter.new({ typeTag: `0x2::coin::Coin<${type}>` }), p),
  });

  if (q.isPending) return <LoadingBlock label="coinMetadata() + totalSupply()…" />;
  if (q.error) return <ErrorNote error={q.error} />;
  const { meta, supply } = q.data!;

  const decimals = meta?.decimals ?? null;
  // d.ts types meta.supply as BigInt, but the GraphQL layer hands back a
  // decimal string at runtime — normalise everything through toBig.
  const supplyBig = supply ?? toBig(meta?.supply as bigint | string | null | undefined);
  const symbol = meta?.symbol ?? parts?.name ?? "?";
  const letter = symbol.charAt(0).toUpperCase() || "?";

  // Plain-JSON copy of the CoinMetadata record (ObjectId / bigint converted).
  const rawMeta = meta
    ? {
        address: meta.address.toHex(),
        decimals: meta.decimals ?? null,
        description: meta.description ?? null,
        iconUrl: meta.iconUrl ?? null,
        name: meta.name ?? null,
        symbol: meta.symbol ?? null,
        supply: meta.supply != null ? String(meta.supply) : null,
        version: meta.version.toString(),
      }
    : null;

  return (
    <>
      <div className="page-head">
        <div className="crumbs">
          <Link to="/objects">OBJECTS</Link> / COIN
        </div>
        <h1>
          {meta?.iconUrl && !iconBroken ? (
            <img
              src={meta.iconUrl}
              alt=""
              loading="lazy"
              onError={() => setIconBroken(true)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 6,
                objectFit: "cover",
                border: "1px solid var(--hairline-strong)",
                background: "var(--bg-inset)",
                alignSelf: "center",
              }}
            />
          ) : (
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 6,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--hairline-strong)",
                background: "var(--bg-inset)",
                color: "var(--teal)",
                fontFamily: "var(--font-mono)",
                fontSize: 19,
                alignSelf: "center",
                flex: "none",
              }}
            >
              {letter}
            </span>
          )}
          {symbol}
          {meta?.name && meta.name !== symbol && <span className="muted" style={{ fontSize: 17 }}>{meta.name}</span>}
          {native && <Pill color="teal">native gas token</Pill>}
          {!meta && <Pill color="amber">no metadata registered</Pill>}
        </h1>
        <div className="sub mono" style={{ overflowWrap: "anywhere" }}>
          <Info tip={TERMS.coinType}>
            <span>{type}</span>
          </Info>
          <CopyBtn text={type} />
        </div>
      </div>

      <div className="stat-grid">
        <Stat
          label="Total supply"
          value={supplyBig != null ? (decimals != null ? scale(supplyBig, decimals) : fmtInt(supplyBig)) : "—"}
          hint={
            <Info tip={TERMS.totalSupply}>
              <span>{supplyBig != null ? `${fmtInt(supplyBig)} base units` : "unknown"}</span>
            </Info>
          }
          color="violet"
        />
        <Stat label="Decimals" value={decimals != null ? decimals : "—"} hint="base units per whole coin: 10^decimals" />
        <Stat
          label="Metadata object"
          value={meta ? <ObjectLink id={meta.address.toHex()} /> : "—"}
          hint={
            <Info tip={TERMS.coinMetadata}>
              <span>{meta ? `metadata v${meta.version}` : "not registered on-chain"}</span>
            </Info>
          }
          color="blue"
        />
        <Stat
          label="Coin package"
          value={parts ? <Hash value={parts.pkg} to={`/package/${parts.pkg}`} head={6} tail={6} /> : "—"}
          hint={parts ? `${parts.module}::${parts.name}` : "unparseable type tag"}
          color="amber"
        />
      </div>

      {meta?.description && (
        <Section index="01" title="Description" aux="provided by the coin's creator">
          <div className="panel pad muted" style={{ lineHeight: 1.6 }}>
            {meta.description}
          </div>
        </Section>
      )}

      <Section index={meta?.description ? "02" : "01"} title="Coin data">
        <Tabs
          tabs={[
            { id: "objects", label: "Sample objects" },
            { id: "raw", label: "Raw metadata" },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === "objects" &&
          (objs.isPending ? (
            <LoadingBlock label={`objects(typeTag: Coin<${symbol}>)…`} />
          ) : objs.error ? (
            <ErrorNote error={objs.error} />
          ) : objs.rows.length === 0 ? (
            <Empty>no live objects of type 0x2::coin::Coin&lt;{type}&gt;</Empty>
          ) : (
            <>
              <div className="panel tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>OBJECT ID</th>
                      <th className="num">
                        <Info tip={TERMS.objectVersion}>VERSION</Info>
                      </th>
                      <th>
                        <Info tip={TERMS.objectDigest}>DIGEST</Info>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {objs.rows.map((o, i) => {
                      const id = o.id().toHex();
                      return (
                        <tr key={id}>
                          <td className="dim">{objs.page * 20 + i + 1}</td>
                          <td>
                            <ObjectLink id={id} />
                          </td>
                          <td className="num dim">{fmtInt(o.version().asU64())}</td>
                          <td>
                            <Hash value={o.digest().toBase58()} copy={false} head={6} tail={6} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pager hasNext={objs.hasMore} onNext={objs.next} onReset={objs.reset} page={objs.page} loading={objs.isFetching} />
            </>
          ))}

        {tab === "raw" &&
          (rawMeta ? (
            <JsonTree data={rawMeta} />
          ) : (
            <Empty>no CoinMetadata registered for this coin type</Empty>
          ))}
      </Section>
    </>
  );
}
