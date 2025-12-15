import { useMemo } from "react";
import { useDBContext } from "../store/DBContext.jsx";
import { sumMonth } from "../store/db";

function ymNow() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function Dashboard() {
  const { db } = useDBContext();
  const ym = ymNow();

  const summary = useMemo(() => sumMonth(db, ym), [db, ym]);

  const card = {
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(6px)",
    maxWidth: 900,
  };

  const row = { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 };

  const pill = (label, value) => (
    <div
      style={{
        flex: "1 1 220px",
        padding: 14,
        borderRadius: 14,
        background: "rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{value}</div>
    </div>
  );

  const brl = (n) =>
    (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div style={card}>
      <h1 style={{ margin: 0, fontSize: 44 }}>Dashboard</h1>
      <div style={{ opacity: 0.75, marginTop: 6 }}>
        Resumo do mês <b>{ym}</b> • {summary.count} lançamentos
      </div>

      <div style={row}>
        {pill("Entradas", brl(summary.income))}
        {pill("Saídas", brl(summary.expense))}
        {pill("Saldo do mês", brl(summary.net))}
      </div>
    </div>
  );
}
