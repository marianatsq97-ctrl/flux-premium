export function normalizeMoney(v) {
  if (v == null) return null;
  const s = String(v).trim();
  if (!s) return null;

  // tira R$, espaços e separadores
  const cleaned = s
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function normalizeDate(v) {
  if (!v) return null;
  const s = String(v).trim();

  // já ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // dd/mm/yyyy ou dd-mm-yyyy
  const m = s.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;

  // excel serial (às vezes vem número)
  const n = Number(s);
  if (Number.isFinite(n) && n > 30000 && n < 60000) {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    epoch.setUTCDate(epoch.getUTCDate() + n);
    const yyyy = epoch.getUTCFullYear();
    const mm = String(epoch.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(epoch.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  return null;
}
