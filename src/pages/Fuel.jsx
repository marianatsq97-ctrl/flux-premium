import { useState } from "react";
import { useDB } from "../store/DBContext.jsx";
import { addFuelLog, delFuelLog, brl, todayISO, cloneDB } from "../store/db";

export default function Fuel() {
  const { db, setDB } = useDB();
  const [date, setDate] = useState(todayISO());
  const [liters, setLiters] = useState("");
  const [total, setTotal] = useState("");
  const [note, setNote] = useState("");

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
    const l = Number(String(liters).replace(",", "."));
    const t = Number(String(total).replace(",", "."));
    if (!l || !t) return;

    setDB(prev => {
      const next = cloneDB(prev);
      addFuelLog(next, { date, liters: l, total: t, note });
      return next;
    });

    setLiters(""); setTotal(""); setNote("");
  }

  function remove(id) {
    setDB(prev => {
      const next = cloneDB(prev);
      delFuelLog(next, id);
      return next;
    });
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 40, fontWeight: 900 }}>Combustível</div>
      <div style={{ opacity: 0.75 }}>Litros + total pago.</div>

      <form onSubmit={add} style={{ display: "grid", gridTemplateColumns: "160px 160px 160px 1fr 160px", gap: 10, marginTop: 16 }}>
        <input style={input} type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
        <input style={input} value={liters} onChange={(e)=>setLiters(e.target.value)} placeholder="Litros" />
        <input style={input} value={total} onChange={(e)=>setTotal(e.target.value)} placeholder="Total (R$)" />
        <input style={input} value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Obs (opcional)" />
        <button style={btn} type="submit">Adicionar</button>
      </form>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {(db.fuel?.logs || []).map(l => (
          <div key={l.id} style={{
            padding: 12,
            borderRadius: 14,
            background: "rgba(0,0,0,0.22)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gridTemplateColumns: "120px 140px 140px 1fr 80px",
            gap: 10,
            alignItems: "center",
          }}>
            <div style={{ opacity: 0.8 }}>{l.date}</div>
            <div style={{ fontWeight: 900 }}>{l.liters} L</div>
            <div style={{ fontWeight: 900 }}>{brl(l.total)}</div>
            <div style={{ opacity: 0.75 }}>{l.note}</div>
            <button style={{...btn, padding:"8px 10px", background:"rgba(255,0,0,0.12)"}} type="button" onClick={()=>remove(l.id)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
}
