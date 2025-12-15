const KEY = "flux_premium_v1";

const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

export function cloneDB(obj) {
  if (typeof structuredClone === "function") return structuredClone(obj);
  return JSON.parse(JSON.stringify(obj));
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
export function ymNow() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
}
export function monthKey(dateStr) {
  return dateStr?.slice(0, 7);
}
export function filterByMonth(list, ym) {
  return (list || []).filter(i => monthKey(i.date) === ym);
}
export function brl(n) {
  return (Number(n)||0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function seed() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const today = todayISO();

  return {
    meta: {
      version: 1,
      importHashes: [] // guarda hashes pra evitar duplicados
    },

    accounts: [
      { id: uid(), name: "Nubank", type: "Banco" },
      { id: uid(), name: "Carteira", type: "Dinheiro" },
    ],

    categories: [
      "Salário","Freela","Alimentação","Transporte","Casa","Lazer","Saúde","Investimentos","Combustível","Outros"
    ],

    transactions: [
      {
        id: uid(),
        date: `${yyyy}-${mm}-01`,
        type: "income",
        description: "Salário",
        category: "Salário",
        accountId: null,
        amount: 5000,
        source: "seed"
      },
      {
        id: uid(),
        date: today,
        type: "expense",
        description: "Mercado",
        category: "Alimentação",
        accountId: null,
        amount: 180.5,
        source: "seed"
      },
    ],

    cards: [
      { id: uid(), name: "Nubank", limit: 3000, dueDay: 10, closingDay: 1 },
    ],
    cardPurchases: [],

    loans: [
      { id: uid(), name: "Empréstimo X", principal: 10000, rateMonthly: 2.5, months: 24, paidMonths: 0 }
    ],

    investments: [
      { id: uid(), name: "Reserva", broker: "Banco", balance: 0 }
    ],
    investmentMoves: [],

    fuel: {
      pricePerLiter: 6.0,
      logs: [
        { id: uid(), date: today, liters: 20, total: 120, note: "Teste" }
      ]
    }
  };
}

export function loadDB() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);

    // migração leve caso falte campo
    parsed.meta ||= { version: 1, importHashes: [] };
    parsed.meta.importHashes ||= [];
    parsed.accounts ||= [];
    parsed.categories ||= [];
    parsed.transactions ||= [];
    parsed.cards ||= [];
    parsed.cardPurchases ||= [];

    return parsed;
  } catch {
    return seed();
  }
}

export function saveDB(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

/* ========= HASH / DEDUPE ========= */
export function hashRow(parts) {
  const s = parts.map(p => String(p ?? "").trim().toLowerCase()).join("|");
  // hash simples e estável
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}
export function hasImportHash(db, h) {
  return (db.meta?.importHashes || []).includes(h);
}
export function registerImportHash(db, h) {
  db.meta.importHashes ||= [];
  db.meta.importHashes.unshift(h);
  // limita pra não virar infinito
  if (db.meta.importHashes.length > 20000) db.meta.importHashes.length = 20000;
}

/* ========= MÉTRICAS ========= */
export function sumMonth(db, yyyyMm) {
  const list = filterByMonth(db.transactions || [], yyyyMm);
  const income = list.filter(t => t.type === "income").reduce((a,b)=>a + Number(b.amount||0), 0);
  const expense = list.filter(t => t.type === "expense").reduce((a,b)=>a + Number(b.amount||0), 0);
  return { income, expense, net: income - expense, count: list.length };
}

export function calcAccountBalances(db) {
  const map = {};
  (db.accounts || []).forEach(a => { map[a.id] = 0; });

  (db.transactions || []).forEach(t => {
    if (!t.accountId) return;
    const v = Number(t.amount || 0);
    map[t.accountId] = (map[t.accountId] || 0) + (t.type === "income" ? v : -v);
  });

  return map;
}

/* ========= CRUD ========= */
export function addTx(db, tx) {
  db.transactions ||= [];
  db.transactions.unshift({ id: uid(), ...tx });
  return db;
}
export function delTx(db, id) {
  db.transactions = (db.transactions || []).filter(t => t.id !== id);
  return db;
}

export function addAccount(db, acc) {
  db.accounts ||= [];
  db.accounts.push({ id: uid(), ...acc });
  return db;
}
export function delAccount(db, id) {
  db.accounts = (db.accounts || []).filter(a => a.id !== id);
  // desvincula transações dessa conta
  (db.transactions || []).forEach(t => { if (t.accountId === id) t.accountId = null; });
  return db;
}

export function addFuelLog(db, log) {
  db.fuel ||= { pricePerLiter: 0, logs: [] };
  db.fuel.logs ||= [];
  db.fuel.logs.unshift({ id: uid(), ...log });
  return db;
}
export function delFuelLog(db, id) {
  db.fuel.logs = (db.fuel?.logs || []).filter(l => l.id !== id);
  return db;
}

export function addInvestmentMove(db, move) {
  db.investmentMoves ||= [];
  db.investmentMoves.unshift({ id: uid(), ...move });

  const inv = (db.investments || []).find(i => i.id === move.investmentId);
  if (inv) inv.balance = Number(inv.balance || 0) + Number(move.amount || 0);
  return db;
}

export function addCardPurchase(db, p) {
  db.cardPurchases ||= [];
  db.cardPurchases.unshift({ id: uid(), ...p });
  return db;
}
