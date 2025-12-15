import { useState } from "react";
import { useDB } from "../store/DBContext.jsx";
import { addInvestmentMove, brl, todayISO } from "../store/db";

export default function Investments() {
  const { db, setDB } = useDB();
  const inv = db.investments?.[0];

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());

  const card = {
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    maxWidth: 1100,
  };

  const input = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.25)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
  };

  const btn = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.10)",
    color: "white",
    cursor: "pointer",
    fontWeight: 800,
  };

  function add(e) {
    e.preventDefault();
    const v = Number(String(amount).replace(",", "."));
    if (!v || v <= 0) return;

    setDB((prev) => {
      const next = structuredClone(prev);
      addInvestmentMove(next, { investmentId: inv.id, date, amount: v });
      return next;
    });

    setAmount("");
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 40, fontWeight: 900 }}>Investimentos</div>
      <div style={{ opacity: 0.75 }}>Aportes simples + saldo (sem firula por enquanto).</div>

      <div style={{ marginTop: 14, fontWeight: 900 }}>
        {inv?.name} • Saldo: {brl(inv?.balance)}
      </div>

      <form onSubmit={add} style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <input style={input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input style={input} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Aporte (ex: 200,00)" />
        <button style={btn} type="submit">
          Adicionar aporte
        </button>
      </form>
    </div>
  );
}
