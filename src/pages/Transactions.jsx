import { useMemo, useState } from "react";
import { useDBContext } from "../store/DBContext.jsx";
import { addTransaction, deleteTransaction } from "../store/db";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Transactions() {
  const { db, setDB } = useDBContext();

  const [form, setForm] = useState({
    date: todayISO(),
    type: "expense",
    description: "",
    category: "Outros",
    amount: "",
  });

  const list = useMemo(() => db.transactions || [], [db]);

  const brl = (n) =>
    (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function onSubmit(e) {
    e.preventDefault();
    const amount = Number(String(form.amount).replace(",", "."));
    if (!form.description.trim()) return alert("Coloca uma descrição.");
    if (!amount || amount <= 0) return alert("Valor inválido.");

    setDB((prev) => {
      const next = structuredClone(prev);
      addTransaction(next, { ...form, amount });
      return next;
    });

    setForm((f) => ({ ...f, description: "", amount: "" }));
  }

  function remove(id) {
    setDB((prev) => {
      const next = structuredClone(prev);
      deleteTransaction(next, id);
      return next;
    });
  }

  const card = {
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(6px)",
    maxWidth: 980,
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
    fontWeight: 700,
  };

  return (
    <div style={card}>
      <h1 style={{ margin: 0, fontSize: 40 }}>Transações</h1>
      <div style={{ opacity: 0.75, marginTop: 6 }}>
        Adiciona lançamento e pronto. Sem planilha. (saudade? talvez. mas chega.)
      </div>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gridTemplateColumns: "160px 160px 1fr 200px 160px", gap: 10, marginTop: 16 }}
      >
        <input style={input} type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} />
        <select style={input} value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})}>
          <option value="expense">Saída</option>
          <option value="income">Entrada</option>
        </select>
        <input style={input} placeholder="Descrição" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
        <select style={input} value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})}>
          {(db.categories || []).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input style={input} placeholder="Valor (ex: 120,50)" value={form.amount} onChange={(e)=>setForm({...form, amount:e.target.value})} />
        <button style={{ ...btn, gridColumn: "1 / -1" }} type="submit">Adicionar</button>
      </form>

      <div style={{ marginTop: 18, borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 14 }}>
        {list.length === 0 ? (
          <div style={{ opacity: 0.7 }}>Nenhuma transação ainda.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {list.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 90px 1fr 180px 140px 90px",
                  gap: 10,
                  alignItems: "center",
                  padding: 12,
                  borderRadius: 14,
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ opacity: 0.8 }}>{t.date}</div>
                <div style={{ fontWeight: 800 }}>{t.type === "income" ? "ENT" : "SAI"}</div>
                <div style={{ fontWeight: 700 }}>{t.description}</div>
                <div style={{ opacity: 0.8 }}>{t.category}</div>
                <div style={{ fontWeight: 800 }}>{brl(t.amount)}</div>
                <button
                  style={{ ...btn, padding: "8px 10px", background: "rgba(255,0,0,0.12)" }}
                  onClick={() => remove(t.id)}
                  type="button"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
