const KEY = "flux_premium_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function loadDB() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return JSON.parse(raw);
  } catch {
    return seed();
  }
}

export function saveDB(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function seed() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");

  return {
    meta: { version: 1 },
    accounts: [
      { id: uid(), name: "Nubank", type: "Banco", balance: 0 },
      { id: uid(), name: "Carteira", type: "Dinheiro", balance: 0 },
    ],
    categories: [
      "Salário","Freela","Alimentação","Transporte","Casa","Lazer","Saúde","Investimentos","Outros"
    ],
    transactions: [
      // exemplo
      {
        id: uid(),
        date: `${yyyy}-${mm}-01`,
        type: "income",
        description: "Salário",
        category: "Salário",
        accountId: null,
        amount: 5000,
      },
    ],
  };
}

export function addTransaction(db, tx) {
  const item = { id: uid(), ...tx };
  db.transactions.unshift(item);
  return db;
}

export function deleteTransaction(db, id) {
  db.transactions = db.transactions.filter((t) => t.id !== id);
  return db;
}

export function updateTransaction(db, id, patch) {
  db.transactions = db.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t));
  return db;
}

export function monthKey(dateStr) {
  // yyyy-mm-dd -> yyyy-mm
  return dateStr?.slice(0, 7);
}

export function sumMonth(db, yyyyMm) {
  const list = db.transactions.filter((t) => monthKey(t.date) === yyyyMm);
  const income = list.filter(t => t.type === "income").reduce((a,b)=>a + Number(b.amount||0),0);
  const expense = list.filter(t => t.type === "expense").reduce((a,b)=>a + Number(b.amount||0),0);
  return { income, expense, net: income - expense, count: list.length };
}
