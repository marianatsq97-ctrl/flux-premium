import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  const logoSrc = `${import.meta.env.BASE_URL}logo-flux.png`;
  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <img
          src={logoSrc}
          alt="Flux Premium"
          style={{ height: 34, width: "auto" }}
        />
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/" style={{ textDecoration: "none" }}>Home</Link>
        </nav>
      </header>

      <main style={{ padding: 18 }}>
        <Outlet />
      </main>
    </div>
  );
}
