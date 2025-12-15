import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { DBProvider } from "./store/DBContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DBProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </DBProvider>
  </React.StrictMode>
);
