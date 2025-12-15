import { Outlet, NavLink } from "react-router-dom";

const linkBaseStyle = {
  display: "block",
  padding: "12px 14px",
  borderRadius: 12,
  textDecoration: "none",
  color: "rgba(255,255,255,0.86)",
  fontWeight: 600,
};

const linkActiveStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.10)",
};

function SideLink({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...linkBaseStyle,
        ...(isActive ? linkActiveStyle : null),
      })}
      end
    >
      {children}
    </NavLink>
  );
}

export default function Layout() {
  // logo em public/ (case-sensitive no GitHub Pages)
  const logoSrc = `${import.meta.env.BASE_URL}logo-flux.png`;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        background:
          "radial-gradient(circle at top, #101828 0%, #070b14 55%, #050814 100%)",
        color: "white",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          borderRight: "1px solid rgba(255,255,255,0.08)",
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={logoSrc}
            alt="Flux Premium"
            style={{ width: 34, height: 34, borderRadius: 10 }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>Flux Premium</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              financeiro • controle • visão
            </div>
          </div>
        </div>

        {/* NAV */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            Geral
          </div>

          {/* ✅ sem Home / sem "/" */}
          <SideLink to="/dashboard">Dashboard</SideLink>
          <SideLink to="/transactions">Transações</SideLink>
          <SideLink to="/bills">Contas</SideLink>

          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Módulos
          </div>

          <SideLink to="/investments">Investimentos</SideLink>
          <SideLink to="/fuel">Combustível</SideLink>
          <SideLink to="/loans">Empréstimos</SideLink>
          <SideLink to="/cards">Cartões</SideLink>

          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Análises
          </div>

          <SideLink to="/insights">Insights</SideLink>
          <SideLink to="/forecast">Previsões</SideLink>
          <SideLink to="/charts">Gráficos</SideLink>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", color: "rgba(255,255,255,0.55)" }}>
          <div style={{ fontSize: 12 }}>
            Dica: tudo que você subir no Git, o Pages atualiza sozinho.
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <section style={{ display: "flex", flexDirection: "column" }}>
        {/* TOPBAR */}
        <header
          style={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.12)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ fontWeight: 800 }}>Flux Premium</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
            GitHub Pages ready ✅
          </div>
        </header>

        {/* PAGE */}
        <main style={{ padding: 24 }}>
          <Outlet />
        </main>
      </section>
    </div>
  );
}
