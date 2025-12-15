import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  const logoSrc = `${import.meta.env.BASE_URL}logo-flux.png`;

  const wrap = {
    height: "100vh",
    width: "100%",
    display: "flex",
    overflow: "hidden",
    background: "radial-gradient(circle at top, #151821 0, #050814 45%, #02030a 100%)",
  };

  const sidebar = {
    width: 280,
    minWidth: 280,
    padding: 16,
    borderRight: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.25)",
    overflow: "auto",
  };

  const content = {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const header = {
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.18)",
  };

  const main = {
    padding: 18,
    overflow: "auto",
    height: "calc(100vh - 56px)",
  };

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "14px 14px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    color: "rgba(255,255,255,0.92)",
    background: isActive ? "rgba(255,255,255,0.10)" : "transparent",
    border: isActive ? "1px solid rgba(255,255,255,0.10)" : "1px solid transparent",
    marginBottom: 8,
  });

  const sectionTitle = { marginTop: 14, marginBottom: 10, fontSize: 12, opacity: 0.6 };

  return (
    <div style={wrap}>
      <aside style={sidebar}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <img src={logoSrc} alt="Flux Premium" style={{ height: 34, width: 34 }} />
          <div>
            <div style={{ fontWeight: 900 }}>Flux Premium</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>controle • visão • paz</div>
          </div>
        </div>

        <div style={sectionTitle}>Geral</div>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/transactions" style={linkStyle}>Transações</NavLink>
        <NavLink to="/bills" style={linkStyle}>Contas</NavLink>
        <NavLink to="/cards" style={linkStyle}>Cartões</NavLink>

        <div style={sectionTitle}>Ferramentas</div>
        <NavLink to="/backup" style={linkStyle}>Backup / Restore</NavLink>

        <div style={sectionTitle}>Módulos</div>
        <NavLink to="/investments" style={linkStyle}>Investimentos</NavLink>
        <NavLink to="/fuel" style={linkStyle}>Combustível</NavLink>
        <NavLink to="/loans" style={linkStyle}>Empréstimos</NavLink>

        <div style={sectionTitle}>Análises</div>
        <NavLink to="/insights" style={linkStyle}>Insights</NavLink>
        <NavLink to="/forecast" style={linkStyle}>Previsões</NavLink>
        <NavLink to="/charts" style={linkStyle}>Gráficos</NavLink>

        <div style={{ marginTop: 18, fontSize: 12, opacity: 0.55 }}>
          Tudo que você subir no Git, o Pages atualiza.
        </div>
      </aside>

      <section style={content}>
        <header style={header}>
          <div style={{ fontWeight: 900 }}>Flux Premium</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>GitHub Pages ready ✅</div>
        </header>

        <main style={main}>
          <Outlet />
        </main>
      </section>
    </div>
  );
}
