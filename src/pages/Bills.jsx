import { useState } from "react";
import { useDB } from "../store/DBContext.jsx";
import { addAccount, delAccount } from "../store/db";

export default function Bills() {
  const { db, setDB } = useDB();
  const [name, setName] = useState("");
  const [type, setType] = useState("Banco");

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
    if (!name.trim()) return;

    setDB(prev => {
      const next = structuredClone(prev);
      addAccount(next, { name, type });
      return next;
    });

    setName("");
  }

  function remove(id) {
    setDB(prev => {
      const next = structuredClone(prev);
      delAccount(next, id);
      return next;
    });
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 40, fontWeight: 900 }}>Contas</div>
      <div style={{ opacity: 0.75 }}>Bancos/carteiras. Base pra saldo e relatórios.</div>

      <form onSubmit={add} style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <input style={{...input, flex: "1 1 260px"}} value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nome da conta" />
        <select style={input} value={type} onChange={(e)=>setType(e.target.value)}>
          <option>Banco</option>
          <option>Dinheiro</option>
          <option>Investimento</option>
        </select>
        <button style={btn} type="submit">Adicionar</button>
      </form>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {(db.accounts || []).map(a => (
          <div
            key={a.id}
            style={{
              padding: 12,
              borderRadius: 14,
              background: "rgba(0,0,0,0.22)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 900 }}>{a.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{a.type}</div>
            </div>
            <button style={{...btn, padding:"8px 10px", background:"rgba(255,0,0,0.12)"}} onClick={()=>remove(a.id)} type="button">
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
