import React from "react";

export default function Bills() {
  return (
    <div style={{
      padding: 18,
      borderRadius: 18,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      maxWidth: 900
    }}>
      <h1 style={{ margin: 0, fontSize: 40 }}>Contas</h1>
      <div style={{ opacity: 0.75, marginTop: 8 }}>
        Próximo passo: cadastrar contas e saldo por conta.
      </div>
    </div>
  );
}
