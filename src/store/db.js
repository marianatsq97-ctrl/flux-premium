const KEY = "flux_premium_v1";

const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

export function seed() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const today = `${yyyy}-${mm}-${String(now.getDate()).padStart(2, "0")}`;

  return {
    meta: { version: 1 },

    accounts: [
      { id: uid(), name: "Nubank", type: "Banco", balance: 0 },
      { id: uid(), name: "Carteira", type: "Dinheiro", balance: 0 },
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
      },
      {
        id: uid(),
        date: today,
        type: "expense",
        description: "Mercado",
        category: "Alimentação",
        accountId: null,
        amount: 180.5,
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
      logs: [{ id: uid(), date: today, liters: 20, total: 120, note: "Teste" }]
    }
  };
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

export function brl(n) {
  return (Number(n)||0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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

export function sumMonth(db, yyyyMm) {
  const list = (db.transactions || []).filter(t => monthKey(t.date) === yyyyMm);
  const income = list.filter(t => t.type === "income").reduce((a,b)=>a + Number(b.amount||0), 0);
  const expense = list.filter(t => t.type === "expense").reduce((a,b)=>a + Number(b.amount||0), 0);
  return { income, expense, net: income - expense, count: list.length };
}

/* ===== CRUD ===== */
export function addTx(db, tx) {
  db.transactions.unshift({ id: uid(), ...tx });
  return db;
}
export function delTx(db, id) {
  db.transactions = db.transactions.filter(t => t.id !== id);
  return db;
}

export function addAccount(db, acc) {
  db.accounts.push({ id: uid(), balance: 0, ...acc });
  return db;
}
export function delAccount(db, id) {
  db.accounts = db.accounts.filter(a => a.id !== id);
  return db;
}

export function addFuelLog(db, log) {
  db.fuel.logs.unshift({ id: uid(), ...log });
  return db;
}
export function delFuelLog(db, id) {
  db.fuel.logs = db.fuel.logs.filter(l => l.id !== id);
  return db;
}

export function addInvestmentMove(db, move) {
  db.investmentMoves.unshift({ id: uid(), ...move });
  const inv = db.investments.find(i => i.id === move.investmentId);
  if (inv) inv.balance = Number(inv.balance || 0) + Number(move.amount || 0);
  return db;
}

export function addCardPurchase(db, p) {
  db.cardPurchases.unshift({ id: uid(), ...p });
  return db;
}

/* ===== Helpers p/ Insights/Charts/Forecast ===== */
function parseISO(dateStr) {
  // dateStr: "YYYY-MM-DD"
  const [y,m,d] = String(dateStr || "").split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function daysInMonth(yyyyMm) {
  const [y,m] = yyyyMm.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

export function dayOfMonth(dateStr) {
  const dt = parseISO(dateStr);
  return dt ? dt.getDate() : null;
}

export function groupExpensesByCategory(db, yyyyMm) {
  const list = (db.transactions || [])
    .filter(t => monthKey(t.date) === yyyyMm && t.type === "expense");

  const map = new Map();
  for (const t of list) {
    const c = t.category || "Outros";
    map.set(c, (map.get(c) || 0) + Number(t.amount || 0));
  }

  const rows = Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a,b) => b.total - a.total);

  const total = rows.reduce((a,b)=>a + b.total, 0);
  return { rows, total };
}

export function dailyNetSeries(db, yyyyMm) {
  const dmax = daysInMonth(yyyyMm);
  const incomeByDay = Array(dmax).fill(0);
  const expenseByDay = Array(dmax).fill(0);

  for (const t of (db.transactions || [])) {
    if (monthKey(t.date) !== yyyyMm) continue;
    const day = dayOfMonth(t.date);
    if (!day) continue;
    const idx = day - 1;
    const val = Number(t.amount || 0);
    if (t.type === "income") incomeByDay[idx] += val;
    if (t.type === "expense") expenseByDay[idx] += val;
  }

  const netByDay = incomeByDay.map((inc, i) => inc - expenseByDay[i]);
  return { incomeByDay, expenseByDay, netByDay };
}

export function monthTotalsSeries(db, monthsBack = 6) {
  // retorna últimos N meses (inclui mês atual)
  const now = new Date();
  const out = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const s = sumMonth(db, ym);
    out.push({ ym, ...s });
  }

  return out;
}

export function forecastMonth(db, yyyyMm) {
  // previsão simples: pega o que já rolou no mês e projeta pelo ritmo diário
  const s = sumMonth(db, yyyyMm);
  const dmax = daysInMonth(yyyyMm);

  const today = new Date();
  const ymToday = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}`;
  const dayNow = (ymToday === yyyyMm) ? today.getDate() : dmax;

  const daysPassed = Math.max(1, Math.min(dayNow, dmax));
  const daysLeft = Math.max(0, dmax - daysPassed);

  const avgIncomeDay = s.income / daysPassed;
  const avgExpenseDay = s.expense / daysPassed;

  const projIncome = s.income + avgIncomeDay * daysLeft;
  const projExpense = s.expense + avgExpenseDay * daysLeft;

  return {
    daysPassed,
    daysLeft,
    avgIncomeDay,
    avgExpenseDay,
    projIncome,
    projExpense,
    projNet: projIncome - projExpense,
    current: s
  };
}
