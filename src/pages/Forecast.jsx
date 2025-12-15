import { useMemo } from "react";
import { useDB } from "../store/DBContext.jsx";
import { brl, forecastMonth, ymNow } from "../store/db";

export default function Forecast() {
  const { db } = useDB();
  const ym = ymNow();

  const f = useMemo(() => forecastMonth(db, ym), [db, ym]);

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
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 900 }}>{value}</div>
    </div>
  );

  return (
    <div style={card}>
      <div style={{ fontSize: 40, fontWeight: 900 }}>Previsões</div>
      <div style={{ opacity: 0.75 }}>Projeção simples pelo ritmo diário do mês <b>{ym}</b>.</div>

      <div style={{ marginTop: 14, opacity: 0.8 }}>
        Dias passados: <b>{f.daysPassed}</b> • Dias restantes: <b>{f.daysLeft}</b>
      </div>

      <div style={row}>
        {box("Atual: Entradas", brl(f.current.income))}
        {box("Atual: Saídas", brl(f.current.expense))}
        {box("Atual: Saldo", brl(f.current.net))}
      </div>

      <div style={{ marginTop: 16, fontWeight: 900, fontSize: 18 }}>Projeção até o fim do mês</div>
      <div style={row}>
        {box("Proj. Entradas", brl(f.projIncome))}
        {box("Proj. Saídas", brl(f.projExpense))}
        {box("Proj. Saldo", brl(f.projNet))}
      </div>

      <div style={{ marginTop: 16, opacity: 0.75 }}>
        Média/dia (aprox): Entradas <b>{brl(f.avgIncomeDay)}</b> • Saídas <b>{brl(f.avgExpenseDay)}</b>
      </div>

      <div style={{ marginTop: 10, opacity: 0.6, fontSize: 12 }}>
        Obs: isso não é “bola de cristal”. É previsão de padaria: funciona bem quando você lança todo dia.
      </div>
    </div>
  );
}
