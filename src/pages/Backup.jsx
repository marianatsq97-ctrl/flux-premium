import { useRef } from "react";
import { useDB } from "../store/DBContext.jsx";
import { cloneDB } from "../store/db";

export default function Backup() {
  const { db, setDB } = useDB();
  const fileRef = useRef(null);

  const card = {
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    maxWidth: 1100,
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

  function exportJSON() {
    const data = JSON.stringify(db, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `flux-premium-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  async function importJSON(file) {
    if (!file) return;
    const text = await file.text();

    try {
      const parsed = JSON.parse(text);

      if (!parsed || typeof parsed !== "object") {
        return alert("Arquivo inválido.");
      }

      // validações mínimas
      if (!parsed.meta || !Array.isArray(parsed.transactions)) {
        return alert("Backup não parece ser do Flux Premium.");
      }

      if (!confirm("Isso vai SUBSTITUIR seus dados atuais. Confirmar?")) return;

      setDB(cloneDB(parsed));
      alert("Restore feito. Se algo ficar estranho, recarrega a página.");
    } catch {
      alert("JSON inválido.");
    }
  }

  return (
    <div style={card}>
      <div style={{ fontSize: 40, fontWeight: 900 }}>Backup / Restore</div>
      <div style={{ opacity: 0.75, marginTop: 6 }}>
        Exporta e importa o banco inteiro. Isso aqui salva vidas.
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <button style={btn} onClick={exportJSON} type="button">Exportar backup (JSON)</button>

        <button style={btn} onClick={() => fileRef.current?.click()} type="button">
          Importar backup (JSON)
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            await importJSON(f);
          }}
        />
      </div>

      <div style={{ marginTop: 16, fontSize: 12, opacity: 0.65 }}>
        Dica: faz backup antes de brincar com importações grandes.
      </div>
    </div>
  );
}
