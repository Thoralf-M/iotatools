// Ambiguous-identifier lander: /resolve/:q. Object ids and account addresses
// share the same 32-byte hex space, so links from generic JSON (event
// payloads, Move contents) come here; we ask the chain what the id actually
// is and redirect. Same logic as the global search box.

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadingBlock } from "../components/ui";
import { resolveQuery } from "../lib/resolve";
import { useClient } from "../lib/sdk";

export default function Resolve() {
  const { q = "" } = useParams();
  const client = useClient();
  const nav = useNavigate();
  const [miss, setMiss] = useState(false);

  useEffect(() => {
    let alive = true;
    setMiss(false);
    resolveQuery(q, client)
      .then((r) => {
        if (!alive) return;
        if (r) nav(r.to, { replace: true });
        else setMiss(true);
      })
      .catch(() => alive && setMiss(true));
    return () => {
      alive = false;
    };
  }, [q, client, nav]);

  if (!miss) return <LoadingBlock label={`identifying ${q.slice(0, 24)}…`} />;
  return (
    <>
      <div className="page-head">
        <h1>NO MATCH</h1>
        <div className="sub mono" style={{ overflowWrap: "anywhere" }}>{q}</div>
      </div>
      <div className="panel pad row" style={{ gap: 10 }}>
        <Link className="btn ghost" to={`/address/${q}`}>try as address</Link>
        <Link className="btn ghost" to={`/object/${q}`}>try as object</Link>
        <Link className="btn ghost" to={`/tx/${q}`}>try as transaction</Link>
      </div>
    </>
  );
}
