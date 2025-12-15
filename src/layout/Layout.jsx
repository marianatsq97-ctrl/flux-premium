import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  const logoSrc = `${import.meta.env.BASE_URL}logo-flux.png`;

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "12px 14px",
    borderRadius: 12,
    textDecoration: "none",
    color: "rgba(255,255,255,0.88)",
    background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
    border: isActive ? "1px solid rgba(255,255,255,0.10)" : "1px solid transparent",
  });

  const sectionTitle = {
    margin: "18px 0 10px",
    fontSize: 12,
    opacity: 0.65,
    letterSpacing: 0.3,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        background:
          "radial-gradient(circle at top, #151821 0, #050814 45%, #02030a 100%)",
        color: "white",
        display: "flex",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: 280,
          padding: 16,
          borderRight: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <img src={logoSrc} alt="Flux Premium" style={{ height: 34, width: "auto" }} />
          <div>
            <div style={{ fontWeight: 800, lineHeight: 1.1 }}>Flux Premium</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>financeiro • controle • visão</div>
          </div>
        </div>

        <div style={sectionTitle}>Geral</div>
        <nav style={{ display: "grid", gap: 10 }}>
          <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
          <NavLink to="/transactions" style={linkStyle}>Transações</NavLink>
          <NavLink to="/bills" style={linkStyle}>Contas</NavLink>
        </nav>

        <div style={sectionTitle}>Módulos</div>
        <nav style={{ display: "grid", gap: 10 }}>
          <NavLink to="/investments" style={linkStyle}>Investimentos</NavLink>
          <NavLink to="/fuel" style={linkStyle}>Combustível</NavLink>
          <NavLink to="/loans" style={linkStyle}>Empréstimos</NavLink>
          <NavLink to="/cards" style={linkStyle}>Cartões</NavLink>
        </nav>

        <div style={sectionTitle}>Análises</div>
        <nav style={{ display: "grid", gap: 10 }}>
          <NavLink to="/insights" style={linkStyle}>Insights</NavLink>
          <NavLink to="/forecast" style={linkStyle}>Previsões</NavLink>
          <NavLink to="/charts" style={linkStyle}>Gráficos</NavLink>
        </nav>

        <div style={{ marginTop: 18, fontSize: 12, opacity: 0.65 }}>
          Dica: tudo que você subir no Git, o Pages atualiza sozinho.
        </div>
      </aside>

      {/* CONTENT */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <div style={{ fontWeight: 800 }}>Flux Premium</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>GitHub Pages ready ✅</div>
        </header>

        <main style={{ padding: 18, width: "100%", flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
