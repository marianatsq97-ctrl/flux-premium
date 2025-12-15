import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Investments from "./pages/Investments.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* rota padrão */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="investments" element={<Investments />} />
      </Route>
    </Routes>
  );
}
