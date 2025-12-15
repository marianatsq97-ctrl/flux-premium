import { useMemo } from "react";
import { useDB } from "../store/DBContext.jsx";
import { brl, groupExpensesByCategory, sumMonth, ymNow } from "../store/db";

export default function Insights() {
  const { db } = useDB();
  const ym = ymNow();

  const { rows, total } = useMemo(() => groupExpensesByCategory(db, ym), [db, ym]);
  const s = useMemo(() => sumMonth(db, ym), [db, ym]);

  const card = {
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    maxWidth: 1100,
  };

  const pill = (text) => ({
    display: "inline-block",
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 12,
    opacity: 0.9
  });

  const top3 = rows.slice(0, 3);
  const pct = (v) => total > 0 ? (v / total) * 100 : 0;

  const alerts = [];
  if (s.expense > s.income && s.income > 0) alerts.push("⚠️ Você gastou mais do que entrou (mês negativo).");
  if (s.income === 0 && s.expense > 0) alerts.push("⚠️ Tem gasto, mas não tem entrada registrada.");
  if ((db.transactions || []).length < 5) alerts.push("👀 Poucos lançamentos. Esse app fica bom quando você alimenta.");

  return (
    <div style={card}>
      <div style={{ fontSize: 40, fontWeight: 900 }}>Insights</div>
      <div style={{ opacity: 0.75 }}>Mês <b>{ym}</b> • leitura rápida do seu comportamento.</div>

      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={pill(`Entradas: ${brl(s.income)}`)} />
        <div style={pill(`Saídas: ${brl(s.expense)}`)} />
        <div style={pill(`Saldo: ${brl(s.net)}`)} />
      </div>

      <div style={{ marginTop: 18, fontWeight: 900, fontSize: 18 }}>Top gastos por categoria</div>

      <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
        {top3.length === 0 && (
          <div style={{ opacity: 0.75 }}>Sem gastos no mês ainda. Milagre? 😅</div>
        )}

        {top3.map((r) => (
          <div
            key={r.category}
            style={{
              padding: 12,
              borderRadius: 14,
              background: "rgba(0,0,0,0.22)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "grid",
              gridTemplateColumns: "1fr 180px 80px",
              gap: 10,
              alignItems: "center"
            }}
          >
            <div style={{ fontWeight: 900 }}>{r.category}</div>
            <div style={{ fontWeight: 900, textAlign: "right" }}>{brl(r.total)}</div>
            <div style={{ opacity: 0.8, textAlign: "right" }}>{pct(r.total).toFixed(0)}%</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, fontWeight: 900, fontSize: 18 }}>Alertas</div>
      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {alerts.length === 0 ? (
          <div style={{ opacity: 0.75 }}>Tudo sob controle. Continua assim.</div>
        ) : (
          alerts.map((a, i) => (
            <div
              key={i}
              style={{
                padding: 12,
                borderRadius: 14,
                background: "rgba(0,0,0,0.22)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {a}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
