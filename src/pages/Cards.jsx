import { useMemo, useState } from "react";
import { useDB } from "../store/DBContext.jsx";
import {
  addCardPurchase,
  brl,
  todayISO,
  ymNow,
  filterByMonth,
  hashRow,
  hasImportHash,
  registerImportHash,
  cloneDB
} from "../store/db";
import { parseCSV } from "../utils/csv";
import { parseExcel } from "../utils/excel";
import { normalizeDate, normalizeMoney } from "../utils/normalize";

export default function Cards() {
  const { db, setDB } = useDB();
  const cardItem = db.cards?.[0];

  const [ym, setYm] = useState(ymNow());

  const [date, setDate] = useState(todayISO());
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  const list = useMemo(() => {
    const all = (db.cardPurchases || []).filter(p => p.cardId === cardItem?.id);
    return filterByMonth(all, ym);
  }, [db, ym, cardItem?.id]);

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

  function addManual(e) {
    e.preventDefault();
    const v = Number(String(amount).replace(",", "."));
    if (!desc.trim() || !v) return alert("Descrição e valor, princesa.");

    setDB(prev => {
      const next = cloneDB(prev);
      addCardPurchase(next, {
        cardId: cardItem.id,
        date,
        description: desc.trim(),
        amount: v,
        source: "manual"
      });
      return next;
    });

    setDesc(""); setAmount("");
  }

  async function onFile(file) {
    if (!file) return;

    let rows = [];
    if (file.name.toLowerCase().endsWith(".csv")) {
      rows = await parseCSV(file);
    } else {
      rows = await parseExcel(file);
    }
    await importRows(rows);
  }

  async function importRows(rows) {
    if (!cardItem?.id) return alert("Cartão não encontrado no DB.");

    let imported = 0;
    let skipped = 0;

    setDB(prev => {
      const next = cloneDB(prev);

      rows.forEach(r => {
        // tenta vários nomes comuns de coluna
        const dateRaw =
          r.Data || r.data || r.Date || r.date || r["Data da compra"] || r["Data"];
        const descRaw =
          r.Descrição || r.descricao || r.Description || r.description || r["Descrição"] || r["Historico"] || r["Histórico"];
        const amountRaw =
          r.Valor || r.valor || r.Amount || r.amount || r["Valor (R$)"] || r["Valor"];

        const d = normalizeDate(dateRaw);
        const a = normalizeMoney(amountRaw);
        const s = (descRaw ?? "").toString().trim();

        if (!d || !s || !a || a === 0) { skipped++; return; }

        const h = hashRow([cardItem.id, d, s, a]);
        if (hasImportHash(next, h)) { skipped++; return; }

        addCardPurchase(next, {
          cardId: cardItem.id,
          date: d,
          description: s,
          amount: a,
          source: "import"
        });

        registerImportHash(next, h);
        imported++;
      });

      return next;
    });

    alert(`Importado: ${imported} | Ignorados: ${skipped}`);
  }

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 40, fontWeight: 900 }}>Cartões</div>
          <div style={{ opacity: 0.75 }}>Manual + Import CSV/Excel. Sem duplicar.</div>
          <div style={{ marginTop: 10, fontWeight: 900 }}>
            {cardItem?.name} • Limite: {brl(cardItem?.limit)} • Venc.: dia {cardItem?.dueDay}
          </div>
        </div>

        <input type="month" value={ym} onChange={(e)=>setYm(e.target.value)} style={input} />
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <label style={{ fontSize: 12, opacity: 0.8, fontWeight: 800 }}>
          Importar fatura (CSV / XLS / XLSX):
        </label>
        <input
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            await onFile(file);
          }}
          style={{ ...input, padding: "8px 10px" }}
        />
      </div>

      <form onSubmit={addManual} style={{ display: "grid", gridTemplateColumns: "160px 1fr 160px 160px", gap: 10, marginTop: 16 }}>
        <input style={input} type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
        <input style={input} value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Descrição" />
        <input style={input} value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Valor" />
        <button style={btn} type="submit">Adicionar</button>
      </form>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {list.map(p => (
          <div key={p.id} style={{
            padding: 12,
            borderRadius: 14,
            background: "rgba(0,0,0,0.22)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gridTemplateColumns: "120px 1fr 160px 110px",
            gap: 10
          }}>
            <div style={{ opacity: 0.8 }}>{p.date}</div>
            <div style={{ fontWeight: 800 }}>{p.description}</div>
            <div style={{ fontWeight: 900 }}>{brl(p.amount)}</div>
            <div style={{ fontSize: 12, opacity: 0.65, textAlign: "right" }}>{p.source || "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
