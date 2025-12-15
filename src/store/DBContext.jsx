import React, { createContext, useContext } from "react";
import { useDB } from "./useDB";

const DBContext = createContext(null);

export function DBProvider({ children }) {
  const value = useDB();
  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}

export function useDBContext() {
  const ctx = useContext(DBContext);
  if (!ctx) throw new Error("useDBContext must be used inside DBProvider");
  return ctx;
}
