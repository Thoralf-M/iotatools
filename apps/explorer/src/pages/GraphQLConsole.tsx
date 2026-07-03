// GraphQL console: raw queries through the same wasm client the explorer
// uses (client.runQuery), with presets and the live service config.

import { useMutation, useQuery } from "@tanstack/react-query";
import { Query } from "@iota/sdk-wasm";
import React, { useState } from "react";
import { JsonTree } from "../components/JsonTree";
import { ErrorNote, KV, Section, Spinner } from "../components/ui";
import { parseRunQuery } from "../lib/checkpoints";
import { useClient, useNetwork } from "../lib/sdk";

const PRESETS: Record<string, { query: string; variables?: string }> = {
  "chain id": {
    query: `query {\n  chainIdentifier\n}`,
  },
  "current epoch": {
    query: `query {\n  epoch {\n    epochId\n    startTimestamp\n    referenceGasPrice\n    totalTransactions\n    totalCheckpoints\n    totalGasFees\n  }\n}`,
  },
  "epoch by id": {
    query: `query Epoch($id: UInt53) {\n  epoch(id: $id) {\n    epochId\n    startTimestamp\n    endTimestamp\n    totalTransactions\n    validatorSet {\n      totalStake\n    }\n  }\n}`,
    variables: `{\n  "id": 100\n}`,
  },
  "latest checkpoints": {
    query: `query {\n  checkpoints(last: 5) {\n    nodes {\n      sequenceNumber\n      digest\n      timestamp\n      networkTotalTransactions\n    }\n  }\n}`,
  },
  "transaction by digest": {
    query: `query Tx($digest: String!) {\n  transactionBlock(digest: $digest) {\n    digest\n    sender { address }\n    effects {\n      status\n      gasEffects {\n        gasSummary {\n          computationCost\n          storageCost\n          storageRebate\n        }\n      }\n    }\n  }\n}`,
    variables: `{\n  "digest": "<base58 digest>"\n}`,
  },
  "object by id": {
    query: `query Obj($address: IotaAddress!) {\n  object(address: $address) {\n    address\n    version\n    digest\n    asMoveObject {\n      contents {\n        type { repr }\n        json\n      }\n    }\n  }\n}`,
    variables: `{\n  "address": "0x6"\n}`,
  },
  "service config": {
    query: `query {\n  serviceConfig {\n    maxQueryDepth\n    maxQueryNodes\n    maxPageSize\n    maxQueryPayloadSize\n  }\n}`,
  },
  "balance changes of a tx": {
    query: `query Tx($digest: String!) {\n  transactionBlock(digest: $digest) {\n    effects {\n      timestamp\n      checkpoint { sequenceNumber }\n      balanceChanges(first: 50) {\n        nodes { owner { address } amount coinType { repr } }\n      }\n    }\n  }\n}`,
    variables: `{\n  "digest": "<base58 digest>"\n}`,
  },
  "address portfolio": {
    query: `query Portfolio($a: IotaAddress!) {\n  address(address: $a) {\n    balances(first: 20) { nodes { coinType { repr } totalBalance coinObjectCount } }\n    stakedIotas(first: 20) { nodes { principal estimatedReward stakeStatus } }\n  }\n}`,
    variables: `{\n  "a": "0x..."\n}`,
  },
  "object display (NFT metadata)": {
    query: `query Display($a: IotaAddress!) {\n  object(address: $a) {\n    display { key value }\n    asMoveObject { contents { type { repr } } }\n  }\n}`,
    variables: `{\n  "a": "0x..."\n}`,
  },
  "validator set": {
    query: `query {\n  epoch {\n    validatorSet {\n      totalStake\n      activeValidators(first: 10) {\n        nodes { name stakingPoolIotaBalance commissionRate apy }\n      }\n    }\n  }\n}`,
  },
};

export default function GraphQLConsole() {
  const client = useClient();
  const { network, endpoint } = useNetwork();
  const [queryText, setQueryText] = useState(PRESETS["current epoch"].query);
  const [varsText, setVarsText] = useState("");

  const svc = useQuery({
    queryKey: [network, "service-config"],
    queryFn: async () => client.serviceConfig(),
  });

  const run = useMutation({
    mutationFn: async () => {
      if (varsText.trim()) {
        JSON.parse(varsText); // surface bad JSON before the FFI does
      }
      const q = Query.new({ queryString: queryText, variables: varsText.trim() || undefined });
      return parseRunQuery(await client.runQuery(q));
    },
  });

  return (
    <>
      <div className="page-head">
        <h1>GRAPHQL CONSOLE</h1>
        <div className="sub">
          Queries execute through <span className="mono">client.runQuery(Query)</span> in wasm — same transport as every page here ·{" "}
          <span className="mono">{endpoint}</span>
        </div>
      </div>

      <Section index="00" title="Presets">
        <div className="row" style={{ gap: 8 }}>
          {Object.entries(PRESETS).map(([name, p]) => (
            <button
              key={name}
              className="btn ghost"
              onClick={() => {
                setQueryText(p.query);
                setVarsText(p.variables ?? "");
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </Section>

      <div className="gql-grid">
        <div>
          <Section index="01" title="Query">
            <textarea
              className="code"
              rows={16}
              spellCheck={false}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") run.mutate();
              }}
            />
            <div className="field" style={{ marginTop: 10 }}>
              <label>variables (json)</label>
              <textarea className="code" rows={4} spellCheck={false} value={varsText} onChange={(e) => setVarsText(e.target.value)} placeholder="{ }" />
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn" onClick={() => run.mutate()} disabled={run.isPending}>
                {run.isPending ? <Spinner /> : "run"} ⌘↩
              </button>
            </div>
          </Section>
        </div>
        <div>
          <Section index="02" title="Result">
            {run.error ? (
              <ErrorNote error={run.error} />
            ) : run.data !== undefined ? (
              <JsonTree data={run.data} />
            ) : (
              <div className="empty">run a query — the result lands here as a navigable tree</div>
            )}
          </Section>
        </div>
      </div>

      <Section index="03" title="Service config" aux="limits enforced by this GraphQL endpoint">
        {svc.isPending ? (
          <div className="loading-block"><Spinner /></div>
        ) : svc.error ? (
          <ErrorNote error={svc.error} />
        ) : (
          <KV
            rows={[
              ["Default / max page size", `${svc.data!.defaultPageSize} / ${svc.data!.maxPageSize}`],
              ["Max query depth", String(svc.data!.maxQueryDepth)],
              ["Max query nodes", String(svc.data!.maxQueryNodes)],
              ["Max output nodes", String(svc.data!.maxOutputNodes)],
              ["Max payload size", `${svc.data!.maxQueryPayloadSize} bytes`],
              ["Max Move value depth", String(svc.data!.maxMoveValueDepth)],
              ["Max type nodes / arg depth / arg width", `${svc.data!.maxTypeNodes} / ${svc.data!.maxTypeArgumentDepth} / ${svc.data!.maxTypeArgumentWidth}`],
              ["Enabled features", svc.data!.enabledFeatures.map(String).join(", ") || "—"],
            ]}
          />
        )}
      </Section>
    </>
  );
}
