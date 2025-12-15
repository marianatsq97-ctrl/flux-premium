import { useMemo } from "react";
import { useDB } from "../store/DBContext.jsx";
import { brl, sumMonth, ymNow } from "../store/db";

export default function Dashboard() {
  const { db } = useDB();
  const ym = ymNow();
  const s = useMemo(() => sumMonth(db, ym), [db, ym]);

  const card = {
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    maxWidth: 1100,
  };

  const row = { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 };

  const box = (label, value) => (
    <div style={{
      flex: "1 1 240px",
      padding: 14,
      borderRadius: 14,
      background: "rgba(0,0,0,0.22)",
      border: "1px solid rgba(255,255,255,0.08)"
    }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 24, fontWeight: 900 }}>{value}</div>
    </div>
  );

  return (
    <div style={card}>
      <div style={{ fontSize: 46, fontWeight: 900 }}>Dashboard</div>
      <div style={{ opacity: 0.75 }}>Resumo do mês <b>{ym}</b> • {s.count} lançamentos</div>

      <div style={row}>
        {box("Entradas", brl(s.income))}
        {box("Saídas", brl(s.expense))}
        {box("Saldo do mês", brl(s.net))}
      </div>
    </div>
  );
}
