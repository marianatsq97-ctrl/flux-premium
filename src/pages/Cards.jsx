import { useState } from "react";
import { useDB } from "../store/DBContext.jsx";
import { addCardPurchase, brl, todayISO } from "../store/db";

export default function Cards() {
  const { db, setDB } = useDB();
  const cardItem = db.cards?.[0];

  const [date, setDate] = useState(todayISO());
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

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
    if (!desc.trim() || !v) return;

    setDB((prev) => {
      const next = structuredClone(prev);
      addCardPurchase(next, { cardId: cardItem.id, date, description: desc, amount: v });
      return next;
    });

    setDesc("");
    setAmount("");
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 40, fontWeight: 900 }}>Cartões</div>
      <div style={{ opacity: 0.75 }}>Compra no cartão + base pra fatura.</div>

      <div style={{ marginTop: 14, fontWeight: 900 }}>
        {cardItem?.name} • Limite: {brl(cardItem?.limit)} • Venc.: dia {cardItem?.dueDay}
      </div>

      <form
        onSubmit={add}
        style={{
          display: "grid",
          gridTemplateColumns: "160px 1fr 160px 160px",
          gap: 10,
          marginTop: 16,
        }}
      >
        <input style={input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input style={input} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descrição" />
        <input style={input} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor" />
        <button style={btn} type="submit">
          Adicionar
        </button>
      </form>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {(db.cardPurchases || [])
          .filter((p) => p.cardId === cardItem?.id)
          .map((p) => (
            <div
              key={p.id}
              style={{
                padding: 12,
                borderRadius: 14,
                background: "rgba(0,0,0,0.22)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "grid",
                gridTemplateColumns: "120px 1fr 160px",
                gap: 10,
              }}
            >
              <div style={{ opacity: 0.8 }}>{p.date}</div>
              <div style={{ fontWeight: 800 }}>{p.description}</div>
              <div style={{ fontWeight: 900 }}>{brl(p.amount)}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
