import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', color: '#fff', display: 'flex' }}>
      <aside style={{ width: 260, borderRight: '1px solid #1f2937', padding: 16 }}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>Flux Premium</div>
        <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 16 }}>
          {user ? (user.full_name || user.email) : 'Carregando usuário...'}
        </div>

        {[
          ['Dashboard', 'Dashboard', '/'],
          ['Lançamentos', 'Transactions', '/transactions'],
          ['Contas', 'Bills', '/bills'],
          ['Gráficos', 'Charts', '/charts'],
          ['Insights', 'Insights', '/insights'],
          ['Previsão', 'Forecast', '/forecast'],
          ['Cartões', 'Cards', '/cards'],
          ['Investimentos', 'Investments', '/investments'],
          ['Empréstimos', 'Loans', '/loans'],
          ['Combustível', 'Fuel', '/fuel'],
        ].map(([label, page]) => (
          <Link
            key={page}
            to={createPageUrl(page)}
            style={{
              display: 'block',
              padding: '10px 12px',
              marginBottom: 6,
              borderRadius: 12,
              textDecoration: 'none',
              color: currentPageName === page ? '#fff' : '#94a3b8',
              background: currentPageName === page ? '#2563eb' : 'transparent',
            }}
          >
            {label}
          </Link>
        ))}

        <button
          onClick={() => base44.auth.logout()}
          style={{
            marginTop: 14,
            width: '100%',
            padding: 10,
            borderRadius: 12,
            background: '#111827',
            border: '1px solid #1f2937',
            color: '#e2e8f0',
            cursor: 'pointer',
          }}
        >
          Sair
        </button>
      </aside>

      <main style={{ flex: 1, padding: 22 }}>{children}</main>
    </div>
  );
}
