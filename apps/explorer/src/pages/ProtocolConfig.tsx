// Protocol config browser: every feature flag and parameter for a protocol
// version, searchable. The chain's rulebook, as the node sees it.

import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorNote, LoadingBlock, Pill, Section } from "../components/ui";
import { useClient, useNetwork } from "../lib/sdk";

export default function ProtocolConfig() {
  const { version } = useParams();
  const nav = useNavigate();
  const client = useClient();
  const { network } = useNetwork();
  const [filter, setFilter] = useState("");

  const q = useQuery({
    queryKey: [network, "protocol", version ?? "latest"],
    queryFn: () => client.protocolConfig(version ? BigInt(version) : undefined),
  });

  const flags = useMemo(() => {
    const f = q.data?.featureFlags ?? [];
    const needle = filter.toLowerCase();
    return needle ? f.filter((x) => x.key.toLowerCase().includes(needle)) : f;
  }, [q.data, filter]);

  const configs = useMemo(() => {
    const c = q.data?.configs ?? [];
    const needle = filter.toLowerCase();
    return needle ? c.filter((x) => x.key.toLowerCase().includes(needle)) : c;
  }, [q.data, filter]);

  if (q.isPending) return <LoadingBlock label="protocolConfig(version)…" />;
  if (q.error) return <ErrorNote error={q.error} />;
  const d = q.data!;

  return (
    <>
      <div className="page-head">
        <h1>
          PROTOCOL CONFIG
          <Pill color="violet">v{String(d.protocolVersion)}</Pill>
        </h1>
        <div className="sub">
          {d.featureFlags.length} feature flags · {d.configs.length} parameters — via{" "}
          <span className="mono">client.protocolConfig({version ?? "latest"})</span>
        </div>
      </div>

      <Section index="00" title="Lookup">
        <div className="panel pad row" style={{ gap: 12 }}>
          <input
            className="input"
            style={{ flex: 1, maxWidth: 380 }}
            placeholder="filter keys… e.g. gas, consensus, passkey"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <input
            className="input"
            style={{ width: 130 }}
            placeholder={`version (${d.protocolVersion})`}
            onKeyDown={(e) => {
              const v = (e.target as HTMLInputElement).value;
              if (e.key === "Enter" && /^\d+$/.test(v)) nav(`/protocol/${v}`);
            }}
          />
          <span className="faint small mono">enter to load another version</span>
        </div>
      </Section>

      <div className="grid-2">
        <Section index="01" title="Feature flags" aux={`${flags.length} shown`}>
          <div className="panel tbl-wrap" style={{ maxHeight: 560, overflowY: "auto" }}>
            <table className="tbl">
              <tbody>
                {flags.map((f) => (
                  <tr key={f.key}>
                    <td style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>{f.key}</td>
                    <td className="num">
                      {f.value ? <Pill color="teal">ON</Pill> : <Pill>OFF</Pill>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section index="02" title="Parameters" aux={`${configs.length} shown`}>
          <div className="panel tbl-wrap" style={{ maxHeight: 560, overflowY: "auto" }}>
            <table className="tbl">
              <tbody>
                {configs.map((c) => (
                  <tr key={c.key}>
                    <td style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>{c.key}</td>
                    <td className="num" style={{ overflowWrap: "anywhere" }}>
                      {c.value ?? <span className="faint">null</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </>
  );
}
