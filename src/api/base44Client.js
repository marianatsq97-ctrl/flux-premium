// src/api/base44Client.js
// Simulação Base44 para rodar LOCAL e no GitHub Pages (sem backend)

const STORAGE_KEY = 'flux_premium_db_v1';

/* =========================
   Utils de storage
========================= */
function loadDB() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function ensureEntity(db, name) {
  if (!db[name]) db[name] = [];
  return db[name];
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function sortList(items, orderBy) {
  if (!orderBy) return items;
  const desc = String(orderBy).startsWith('-');
  const key = desc ? orderBy.slice(1) : orderBy;

  return [...items].sort((a, b) => {
    const av = a?.[key] ?? '';
    const bv = b?.[key] ?? '';
    if (av < bv) return desc ? 1 : -1;
    if (av > bv) return desc ? -1 : 1;
    return 0;
  });
}

/* =========================
   Factory de entidades
========================= */
function makeEntity(name) {
  return {
    async list(orderBy, limit = 1000) {
      const db = loadDB();
      const items = ensureEntity(db, name);
      return sortList(items, orderBy).slice(0, limit);
    },

    async create(data) {
      const db = loadDB();
      const items = ensureEntity(db, name);
      const item = { id: uid(), ...data };
      items.push(item);
      saveDB(db);
      return item;
    },

    async update(id, data) {
      const db = loadDB();
      const items = ensureEntity(db, name);
      const index = items.findIndex(i => i.id === id);
      if (index >= 0) {
        items[index] = { ...items[index], ...data };
        saveDB(db);
        return items[index];
      }
      return null;
    },

    async delete(id) {
      const db = loadDB();
      db[name] = ensureEntity(db, name).filter(i => i.id !== id);
      saveDB(db);
      return true;
    },

    async bulkCreate(list) {
      const db = loadDB();
      const items = ensureEntity(db, name);
      const created = list.map(i => ({ id: uid(), ...i }));
      items.push(...created);
      saveDB(db);
      return created;
    },
  };
}

/* =========================
   Cliente Base44 fake
========================= */
export const base44 = {
  auth: {
    async me() {
      const user = JSON.parse(localStorage.getItem('flux_user') || 'null');
      if (user) return user;

      const demoUser = {
        email: 'mariana@demo.com',
        full_name: 'Mariana',
        role: 'admin',
      };

      localStorage.setItem('flux_user', JSON.stringify(demoUser));
      return demoUser;
    },

    logout() {
      localStorage.removeItem('flux_user');
      window.location.reload();
    },
  },

  entities: {
    Transaction: makeEntity('Transaction'),
    Bill: makeEntity('Bill'),
    Card: makeEntity('Card'),
    Investment: makeEntity('Investment'),
    Loan: makeEntity('Loan'),
    Fuel: makeEntity('Fuel'),
    Category: makeEntity('Category'),
  },

  integrations: {
    Core: {
      async InvokeLLM({ prompt }) {
        return `
## 🧠 Análise Financeira (modo demo)

Este ambiente está rodando **sem IA real** (GitHub Pages / local).
Aqui vai uma análise automática simulada:

• Foque em reduzir despesas fixas primeiro  
• Corte 1 gasto grande este mês  
• Priorize reserva de emergência  
• Depois pense em investimento

Prompt recebido (resumo):
${prompt?.slice(0, 300)}...
        `;
      },
    },
  },
};
