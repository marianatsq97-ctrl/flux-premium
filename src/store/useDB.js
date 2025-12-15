import { useEffect, useMemo, useState } from "react";
import { loadDB, saveDB } from "./db";

export function useDB() {
  const [db, setDB] = useState(() => loadDB());

  useEffect(() => {
    saveDB(db);
  }, [db]);

  const api = useMemo(() => ({
    db,
    setDB,
    reset: () => setDB(loadDB()),
  }), [db]);

  return api;
}
