import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Bills from "./pages/Bills.jsx";
import Investments from "./pages/Investments.jsx";
import Fuel from "./pages/Fuel.jsx";
import Loans from "./pages/Loans.jsx";
import Cards from "./pages/Cards.jsx";
import Insights from "./pages/Insights.jsx";
import Forecast from "./pages/Forecast.jsx";
import Charts from "./pages/Charts.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* SEM Home: raiz vai pro Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/bills" element={<Bills />} />

        <Route path="/investments" element={<Investments />} />
        <Route path="/fuel" element={<Fuel />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/cards" element={<Cards />} />

        <Route path="/insights" element={<Insights />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/charts" element={<Charts />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
