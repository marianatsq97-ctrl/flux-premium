import React from "react";

export default function Dashboard() {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(20,34,70,0.85), rgba(10,10,12,0.35))",
        boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 34, letterSpacing: 0.2 }}>
        Dashboard
      </h1>
      <p style={{ marginTop: 10, opacity: 0.9 }}>
        Flux Premium rodando. Próximo passo: colar suas páginas reais.
      </p>
    </div>
  );
}
