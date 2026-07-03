// Package directory: every Move package on the network, newest first.

import React from "react";
import { Link } from "react-router-dom";
import { Empty, ErrorNote, Hash, LoadingBlock, Pager, Section } from "../components/ui";
import { usePagedList } from "../lib/paging";
import { useClient, useNetwork } from "../lib/sdk";

export default function Packages() {
  const client = useClient();
  const { network } = useNetwork();
  const list = usePagedList({
    queryKey: [network, "packages"],
    limit: 25,
    newestFirst: true,
    fetcher: (p) => client.packages(undefined, undefined, p),
  });

  return (
    <>
      <div className="page-head">
        <h1>MOVE PACKAGES</h1>
        <div className="sub">
          Published code, newest first, via <span className="mono">client.packages(PaginationFilter)</span>
        </div>
      </div>
      <Section index="01" title="Directory">
        {list.error ? (
          <ErrorNote error={list.error} />
        ) : list.isPending ? (
          <LoadingBlock />
        ) : list.rows.length === 0 ? (
          <Empty>no packages</Empty>
        ) : (
          <>
            <div className="panel tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>PACKAGE</th>
                    <th className="num">VERSION</th>
                    <th className="num">MODULES</th>
                    <th>MODULE NAMES</th>
                  </tr>
                </thead>
                <tbody>
                  {list.rows.map((p) => {
                    const id = p.id().toHex();
                    const names = [...p.modules().keys()].map(String);
                    return (
                      <tr key={id}>
                        <td><Hash value={id} to={`/package/${id}`} /></td>
                        <td className="num dim">{String(p.version().asU64())}</td>
                        <td className="num dim">{names.length}</td>
                        <td className="dim" style={{ maxWidth: 460, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {names.slice(0, 6).join(", ")}
                          {names.length > 6 ? ` +${names.length - 6}` : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pager hasNext={list.hasMore} onNext={list.next} onReset={list.reset} page={list.page} loading={list.isFetching} />
          </>
        )}
      </Section>
    </>
  );
}
