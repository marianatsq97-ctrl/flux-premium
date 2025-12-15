import { useMemo } from "react";
import { useDB } from "../store/DBContext.jsx";
import { brl, groupExpensesByCategory, sumMonth, ymNow } from "../store/db";

export default function Insights() {
  return (
    <div style={{
      padding: 18, borderRadius: 18,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      maxWidth: 1100
    }}>
      <div style={{ fontSize: 40, fontWeight: 900 }}>Insights</div>
      <div style={{ opacity: 0.75, marginTop: 8 }}>No próximo passo vira “inteligência” de verdade.</div>
    </div>
  );
}
