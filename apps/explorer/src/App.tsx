import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { bootSdk, NetworkProvider } from "./lib/sdk";
import AddressPage from "./pages/AddressPage";
import Analytics from "./pages/Analytics";
import CheckpointDetail from "./pages/CheckpointDetail";
import Checkpoints from "./pages/Checkpoints";
import CoinPage from "./pages/CoinPage";
import Dashboard from "./pages/Dashboard";
import DecoderLab from "./pages/DecoderLab";
import DryRunLab from "./pages/DryRunLab";
import EpochDetail from "./pages/EpochDetail";
import Epochs from "./pages/Epochs";
import Events from "./pages/Events";
import GraphQLConsole from "./pages/GraphQLConsole";
import NamesPage from "./pages/NamesPage";
import Objects from "./pages/Objects";
import ObjectPage from "./pages/ObjectPage";
import Packages from "./pages/Packages";
import PackagePage from "./pages/PackagePage";
import ProtocolConfig from "./pages/ProtocolConfig";
import Resolve from "./pages/Resolve";
import Staking from "./pages/Staking";
import TransactionDetail from "./pages/TransactionDetail";
import Transactions from "./pages/Transactions";
import ValidatorPage from "./pages/ValidatorPage";
import Validators from "./pages/Validators";

// Path routing standalone; hash routing when embedded under iotatools
// (static hosting can't rewrite deep links to the sub-app's index.html).
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 2000,
    },
  },
});

function Boot({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    bootSdk()
      .then(() => setState("ready"))
      .catch((e) => {
        setErr(e instanceof Error ? e.message : String(e));
        setState("failed");
      });
  }, []);

  if (state === "loading") {
    return (
      <div className="boot">
        <img className="mark" src={`${import.meta.env.BASE_URL}tangle.svg`} alt="" />
        <div>LOADING IOTA-SDK WASM MODULE</div>
        <div className="faint">iota-sdk-ffi · uniffi → wasm32-unknown-unknown</div>
      </div>
    );
  }
  if (state === "failed") {
    return (
      <div className="boot">
        <div style={{ color: "var(--coral)" }}>WASM BOOT FAILED</div>
        <div className="faint" style={{ maxWidth: 520, textAlign: "center", letterSpacing: 0 }}>{err}</div>
        <div className="faint" style={{ letterSpacing: 0 }}>
          build the bindings first: <code>cd ../iota-rust-sdk && make wasm</code>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="page-head">
      <h1>404</h1>
      <div className="sub">nothing at this route — try the search above</div>
    </div>
  );
}

export default function App() {
  return (
    <Boot>
      <QueryClientProvider client={queryClient}>
        <NetworkProvider>
          <Router>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="/checkpoints" element={<Checkpoints />} />
                <Route path="/checkpoint/:id" element={<CheckpointDetail />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/tx/:digest" element={<TransactionDetail />} />
                <Route path="/epochs" element={<Epochs />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/epoch/:id" element={<EpochDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/objects" element={<Objects />} />
                <Route path="/object/:id" element={<ObjectPage />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/package/:id" element={<PackagePage />} />
                <Route path="/address/:addr" element={<AddressPage />} />
                <Route path="/coin/:type" element={<CoinPage />} />
                <Route path="/names" element={<NamesPage />} />
                <Route path="/staking" element={<Staking />} />
                <Route path="/validators" element={<Validators />} />
                <Route path="/validator/:addr" element={<ValidatorPage />} />
                <Route path="/graphql" element={<GraphQLConsole />} />
                <Route path="/protocol/:version?" element={<ProtocolConfig />} />
                <Route path="/resolve/:q" element={<Resolve />} />
                <Route path="/lab/decode" element={<DecoderLab />} />
                <Route path="/lab/dryrun" element={<DryRunLab />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </NetworkProvider>
      </QueryClientProvider>
    </Boot>
  );
}
