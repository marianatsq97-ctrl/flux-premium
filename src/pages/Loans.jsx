import { useDB } from "../store/DBContext.jsx";
import { brl } from "../store/db";

export default function Loans() {
  const { db } = useDB();

  const card = {
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    maxWidth: 1100,
  };

  return (
    <div style={card}>
      <div style={{ fontSize: 40, fontWeight: 900 }}>Empréstimos</div>
      <div style={{ opacity: 0.75 }}>Base montada. Depois a gente coloca tabela/parcelas.</div>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {(db.loans || []).map((l) => (
          <div
            key={l.id}
            style={{
              padding: 12,
              borderRadius: 14,
              background: "rgba(0,0,0,0.22)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ fontWeight: 900 }}>{l.name}</div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>
              Principal: {brl(l.principal)} • Juros/mês: {l.rateMonthly}% • Prazo: {l.months} meses
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
