// IOTA-Names: the on-chain naming system. Three independent resolvers:
//   name → address      client.iotaNamesLookup("alice.iota")
//   address → name      client.iotaNamesDefaultName(addr, NameFormat.Dot)
//   address → all regs  client.iotaNamesRegistrations(addr, pagination)
//
// NameRegistration rows carry no target address, so each row's current
// target is resolved with an extra iotaNamesLookup (best effort).

import { useQuery } from "@tanstack/react-query";
import { Address, NameFormat } from "@iota/sdk-wasm";
import React, { useState } from "react";
import { Info, TERMS } from "../components/Info";
import {
  AddressLink,
  Age,
  Empty,
  ErrorNote,
  Hash,
  ObjectLink,
  Pager,
  Pill,
  Section,
  Spinner,
} from "../components/ui";
import { fmtTimestamp } from "../lib/format";
import { usePagedList } from "../lib/paging";
import { errMsg, useClient, useNetwork } from "../lib/sdk";

function ErrLine({ error }: { error: unknown }) {
  return <div className="error-note">⚠ {errMsg(error)}</div>;
}

function QueryForm({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  busy,
  action,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  busy: boolean;
  action: string;
}) {
  return (
    <form
      className="panel pad"
      style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit();
      }}
    >
      <div className="field" style={{ flex: 1, minWidth: 260 }}>
        <label>{label}</label>
        <input className="input" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
      <button className="btn" type="submit" disabled={!value.trim() || busy}>
        {busy ? <Spinner /> : action}
      </button>
    </form>
  );
}

export default function NamesPage() {
  const client = useClient();
  const { network } = useNetwork();

  // ── 1) name → address ─────────────────────────────────────────────────
  const [nameDraft, setNameDraft] = useState("");
  const [nameQuery, setNameQuery] = useState<string | null>(null);
  const lookup = useQuery({
    queryKey: [network, "names-lookup", nameQuery],
    enabled: nameQuery != null,
    retry: false,
    queryFn: async () => {
      const addr = await client.iotaNamesLookup(nameQuery!);
      return addr == null ? null : addr.toHex();
    },
  });

  // ── 2) address → primary name ─────────────────────────────────────────
  const [addrDraft, setAddrDraft] = useState("");
  const [addrQuery, setAddrQuery] = useState<string | null>(null);
  const primary = useQuery({
    queryKey: [network, "names-default", addrQuery],
    enabled: addrQuery != null,
    retry: false,
    queryFn: async () => {
      const name = await client.iotaNamesDefaultName(Address.fromHex(addrQuery!), NameFormat.Dot);
      return name == null ? null : name.format(NameFormat.Dot);
    },
  });

  // ── 3) all registrations of an address ────────────────────────────────
  const [regDraft, setRegDraft] = useState("");
  const [regAddr, setRegAddr] = useState<string | null>(null);
  const regs = usePagedList({
    queryKey: [network, "names-registrations", regAddr],
    limit: 10,
    enabled: regAddr != null,
    fetcher: async (p) => {
      const page = await client.iotaNamesRegistrations(Address.fromHex(regAddr!), p);
      // Resolve each name's current target (registration rows don't carry it).
      const rows = await Promise.all(
        page.data.map(async (reg) => {
          const name = reg.name().format(NameFormat.Dot);
          const target = await client
            .iotaNamesLookup(name)
            .then((a) => (a == null ? undefined : a.toHex()))
            .catch(() => undefined);
          return {
            name,
            isSubname: reg.name().isSubname(),
            expiry: reg.expirationTimestampMs(),
            nftId: reg.id().toHex(),
            target,
          };
        }),
      );
      return { pageInfo: page.pageInfo, data: rows };
    },
  });

  return (
    <>
      <div className="page-head">
        <h1>IOTA-NAMES</h1>
        <div className="sub">
          <Info tip={TERMS.iotaNames}>
            <span>
              Human-readable names via <span className="mono">client.iotaNamesLookup / iotaNamesDefaultName / iotaNamesRegistrations</span>
            </span>
          </Info>
        </div>
      </div>

      <Section index="01" title="Name → address" aux="iotaNamesLookup(name)">
        <div style={{ display: "grid", gap: 10 }}>
          <QueryForm
            label="name"
            placeholder="alice.iota"
            value={nameDraft}
            onChange={setNameDraft}
            onSubmit={() => setNameQuery(nameDraft.trim())}
            busy={lookup.isFetching}
            action="resolve"
          />
          {lookup.error != null && <ErrLine error={lookup.error} />}
          {lookup.isSuccess &&
            (lookup.data != null ? (
              <div className="panel pad row" style={{ gap: 10 }}>
                <Pill color="teal">{nameQuery}</Pill>
                <span className="faint">→</span>
                <AddressLink addr={lookup.data} full />
              </div>
            ) : (
              <Empty>
                <span className="mono">{nameQuery}</span> is not registered
              </Empty>
            ))}
        </div>
      </Section>

      <Section index="02" title="Address → primary name" aux="iotaNamesDefaultName(address, NameFormat.Dot)">
        <div style={{ display: "grid", gap: 10 }}>
          <QueryForm
            label="address"
            placeholder="0x…"
            value={addrDraft}
            onChange={setAddrDraft}
            onSubmit={() => setAddrQuery(addrDraft.trim())}
            busy={primary.isFetching}
            action="resolve"
          />
          {primary.error != null && <ErrLine error={primary.error} />}
          {primary.isSuccess &&
            (primary.data != null ? (
              <div className="panel pad row" style={{ gap: 10 }}>
                <Hash value={addrQuery!} head={8} tail={8} />
                <span className="faint">→</span>
                <Pill color="teal">{primary.data}</Pill>
              </div>
            ) : (
              <Empty>no primary name set for this address</Empty>
            ))}
        </div>
      </Section>

      <Section index="03" title="Registrations of an address" aux="iotaNamesRegistrations(address) — the address's name NFTs">
        <div style={{ display: "grid", gap: 10 }}>
          <QueryForm
            label="address"
            placeholder="0x…"
            value={regDraft}
            onChange={setRegDraft}
            onSubmit={() => {
              regs.reset();
              setRegAddr(regDraft.trim());
            }}
            busy={regs.isFetching}
            action="list"
          />
          {regs.error != null && <ErrLine error={regs.error} />}
          {regAddr != null && !regs.isFetching && regs.error == null && regs.rows.length === 0 && (
            <Empty>this address holds no name registrations</Empty>
          )}
          {regs.rows.length > 0 && (
            <>
              <div className="panel tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>
                        <Info tip={TERMS.expiration}>EXPIRES</Info>
                      </th>
                      <th>TARGET</th>
                      <th>
                        <Info tip="The NFT object representing ownership of this name. Transfer the NFT, transfer the name.">
                          REGISTRATION NFT
                        </Info>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {regs.rows.map((r) => (
                      <tr key={r.nftId}>
                        <td>
                          <span className="row" style={{ gap: 8, display: "inline-flex" }}>
                            <Pill color="teal">{r.name}</Pill>
                            {r.isSubname && <Pill color="violet">SUBNAME</Pill>}
                          </span>
                        </td>
                        <td className="dim">
                          {fmtTimestamp(r.expiry)} <span className="faint">(<Age ms={r.expiry} />)</span>
                        </td>
                        <td>{r.target != null ? <Hash value={r.target} to={`/address/${r.target}`} head={6} tail={6} /> : <span className="faint">—</span>}</td>
                        <td>
                          <ObjectLink id={r.nftId} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager hasNext={regs.hasMore} onNext={regs.next} onReset={regs.reset} page={regs.page} loading={regs.isFetching} />
            </>
          )}
        </div>
      </Section>
    </>
  );
}
