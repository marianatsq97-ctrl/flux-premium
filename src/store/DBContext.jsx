import React, { createContext, useContext, useEffect, useState } from "react";
import { loadDB, saveDB } from "./db";

const DBContext = createContext(null);

export function DBProvider({ children }) {
  const [db, setDB] = useState(() => loadDB());

  useEffect(() => {
    saveDB(db);
  }, [db]);

  return <DBContext.Provider value={{ db, setDB }}>{children}</DBContext.Provider>;
}

export function useDB() {
  const ctx = useContext(DBContext);
  if (!ctx) throw new Error("useDB must be used inside DBProvider");
  return ctx;
}
