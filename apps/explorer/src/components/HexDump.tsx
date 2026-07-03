// Classic offset/hex/ascii dump for BCS bytes.

import React, { useMemo, useState } from "react";
import { CopyBtn } from "./ui";
import { bytesToHex } from "../lib/format";

const ROW = 16;
const MAX_ROWS_COLLAPSED = 24;

export function HexDump({ bytes }: { bytes: Uint8Array }) {
  const [expanded, setExpanded] = useState(false);
  const rows = useMemo(() => {
    const out: Array<{ off: string; hex: React.ReactNode[]; ascii: string }> = [];
    for (let i = 0; i < bytes.length; i += ROW) {
      const slice = bytes.slice(i, i + ROW);
      const hex: React.ReactNode[] = [];
      let ascii = "";
      slice.forEach((b, j) => {
        hex.push(
          <span key={j} className={`b${b === 0 ? " zero" : ""}`}>
            {b.toString(16).padStart(2, "0")}
            {j === 7 ? "  " : " "}
          </span>,
        );
        ascii += b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : "·";
      });
      out.push({ off: i.toString(16).padStart(6, "0"), hex, ascii });
    }
    return out;
  }, [bytes]);

  const visible = expanded ? rows : rows.slice(0, MAX_ROWS_COLLAPSED);

  return (
    <div className="panel" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 6, right: 8, display: "flex", gap: 4, alignItems: "center" }}>
        <span className="faint mono" style={{ fontSize: 10.5 }}>
          {bytes.length} bytes
        </span>
        <CopyBtn text={bytesToHex(bytes)} />
      </div>
      <div className="hexdump">
        {visible.map((r) => (
          <div key={r.off}>
            <span className="off">{r.off}</span>
            {r.hex}
            <span className="ascii">{r.ascii}</span>
          </div>
        ))}
        {!expanded && rows.length > MAX_ROWS_COLLAPSED && (
          <div>
            <button className="btn ghost" style={{ marginTop: 8 }} onClick={() => setExpanded(true)}>
              show all {rows.length} rows
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
