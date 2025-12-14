import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@/layout/Layout';

import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Bills from '@/pages/Bills';
import Charts from '@/pages/Charts';
import Insights from '@/pages/Insights';
import Forecast from '@/pages/Forecast';
import Cards from '@/pages/Cards';
import Investments from '@/pages/Investments';
import Fuel from '@/pages/Fuel';
import Loans from '@/pages/Loans';

function pageNameFromPath(path) {
  if (path === '/') return 'Dashboard';
  if (path.startsWith('/transactions')) return 'Transactions';
  if (path.startsWith('/bills')) return 'Bills';
  if (path.startsWith('/charts')) return 'Charts';
  if (path.startsWith('/insights')) return 'Insights';
  if (path.startsWith('/forecast')) return 'Forecast';
  if (path.startsWith('/cards')) return 'Cards';
  if (path.startsWith('/investments')) return 'Investments';
  if (path.startsWith('/fuel')) return 'Fuel';
  if (path.startsWith('/loans')) return 'Loans';
  return 'Dashboard';
}

export default function App() {
  const location = useLocation();
  const currentPageName = pageNameFromPath(location.pathname);

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/fuel" element={<Fuel />} />
        <Route path="/loans" element={<Loans />} />
      </Routes>
    </Layout>
  );
}
